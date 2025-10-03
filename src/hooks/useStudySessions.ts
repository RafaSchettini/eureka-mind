import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

type StudySession = Tables<'study_sessions'>;

export function useStudySessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSessions() {
      if (!user) {
        setSessions([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('study_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('started_at', { ascending: false });

        if (fetchError) throw fetchError;
        setSessions(data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar sessões');
        setSessions([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSessions();
  }, [user]);

  const startSession = async (contentId?: string) => {
    if (!user) return null;

    try {
      const { data, error: insertError } = await supabase
        .from('study_sessions')
        .insert({
          user_id: user.id,
          content_id: contentId || null,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setSessions(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error starting session:', err);
      return null;
    }
  };

  const endSession = async (sessionId: string, notes?: string) => {
    if (!user) return;

    try {
      const session = sessions.find(s => s.id === sessionId);
      if (!session) return;

      const startedAt = new Date(session.started_at);
      const endedAt = new Date();
      const durationMinutes = Math.round((endedAt.getTime() - startedAt.getTime()) / 60000);

      const { error: updateError } = await supabase
        .from('study_sessions')
        .update({
          ended_at: endedAt.toISOString(),
          duration_minutes: durationMinutes,
          notes: notes || null,
        })
        .eq('id', sessionId);

      if (updateError) throw updateError;

      setSessions(prev =>
        prev.map(s =>
          s.id === sessionId
            ? { ...s, ended_at: endedAt.toISOString(), duration_minutes: durationMinutes, notes }
            : s
        )
      );
    } catch (err) {
      console.error('Error ending session:', err);
    }
  };

  return { sessions, loading, error, startSession, endSession };
}

export function useWeeklyProgress() {
  const { user } = useAuth();
  const [weeklyData, setWeeklyData] = useState<{ day: string; completed: number; goal: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeeklyProgress() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        weekStart.setHours(0, 0, 0, 0);

        const { data, error } = await supabase
          .from('study_sessions')
          .select('started_at')
          .eq('user_id', user.id)
          .gte('started_at', weekStart.toISOString())
          .not('ended_at', 'is', null);

        if (error) throw error;

        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const sessionsPerDay = new Array(7).fill(0);

        data?.forEach(session => {
          const sessionDate = new Date(session.started_at);
          const dayIndex = sessionDate.getDay();
          sessionsPerDay[dayIndex]++;
        });

        const weeklyData = days.map((day, index) => ({
          day,
          completed: sessionsPerDay[index],
          goal: index < 5 ? 4 : 2, // 4 sessões nos dias úteis, 2 no fim de semana
        }));

        setWeeklyData(weeklyData);
      } catch (err) {
        console.error('Error fetching weekly progress:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchWeeklyProgress();
  }, [user]);

  return { weeklyData, loading };
}
