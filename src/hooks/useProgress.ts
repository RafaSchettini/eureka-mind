import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

type UserProgress = Tables<'user_progress'>;
type Content = Tables<'contents'>;

export interface ProgressWithContent extends UserProgress {
  content?: Content;
}

export function useUserProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressWithContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProgress() {
      if (!user) {
        setProgress([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('user_progress')
          .select(`
            *,
            content:contents(*)
          `)
          .eq('user_id', user.id)
          .order('last_accessed_at', { ascending: false, nullsFirst: false });

        if (fetchError) throw fetchError;
        setProgress(data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar progresso');
        setProgress([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
  }, [user]);

  const updateProgress = async (
    contentId: string,
    updates: Partial<Omit<UserProgress, 'id' | 'user_id' | 'content_id' | 'created_at'>>
  ) => {
    if (!user) return;

    try {
      // First check if progress exists
      const { data: existing } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('content_id', contentId)
        .single();

      const progressData = {
        user_id: user.id,
        content_id: contentId,
        status: updates.status || existing?.status || 'not_started',
        progress_percentage: updates.progress_percentage ?? existing?.progress_percentage ?? 0,
        time_spent_minutes: updates.time_spent_minutes ?? existing?.time_spent_minutes ?? 0,
        last_accessed_at: new Date().toISOString(),
        completed_at: updates.completed_at ?? existing?.completed_at ?? null,
      };

      const { error: upsertError } = await supabase
        .from('user_progress')
        .upsert(progressData, {
          onConflict: 'user_id,content_id'
        });

      if (upsertError) throw upsertError;

      // Refresh progress
      const { data } = await supabase
        .from('user_progress')
        .select(`
          *,
          content:contents(*)
        `)
        .eq('user_id', user.id)
        .order('last_accessed_at', { ascending: false, nullsFirst: false });

      if (data) setProgress(data);
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  return { progress, loading, error, updateProgress };
}

export function useProgressStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalTimeMinutes: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        const totalCourses = data?.length || 0;
        const completedCourses = data?.filter(p => p.status === 'completed').length || 0;
        const inProgressCourses = data?.filter(p => p.status === 'in_progress').length || 0;
        const totalTimeMinutes = data?.reduce((sum, p) => sum + (p.time_spent_minutes || 0), 0) || 0;
        const completionRate = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

        setStats({
          totalCourses,
          completedCourses,
          inProgressCourses,
          totalTimeMinutes,
          completionRate,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [user]);

  return { stats, loading };
}
