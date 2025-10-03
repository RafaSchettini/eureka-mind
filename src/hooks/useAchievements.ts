import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

type Achievement = Tables<'achievements'>;
type UserAchievement = Tables<'user_achievements'>;

export interface AchievementWithStatus extends Achievement {
  unlocked: boolean;
  unlockedAt?: string;
}

export function useAchievements() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAchievements() {
      try {
        setLoading(true);

        // Fetch all achievements
        const { data: allAchievements, error: achievementsError } = await supabase
          .from('achievements')
          .select('*')
          .order('created_at', { ascending: true });

        if (achievementsError) throw achievementsError;

        if (!user) {
          setAchievements(
            allAchievements?.map(a => ({ ...a, unlocked: false })) || []
          );
          setLoading(false);
          return;
        }

        // Fetch user's unlocked achievements
        const { data: userAchievements, error: userAchievementsError } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', user.id);

        if (userAchievementsError) throw userAchievementsError;

        const unlockedIds = new Set(userAchievements?.map(ua => ua.achievement_id) || []);
        const unlockedMap = new Map(
          userAchievements?.map(ua => [ua.achievement_id, ua.unlocked_at]) || []
        );

        const achievementsWithStatus: AchievementWithStatus[] = allAchievements?.map(a => ({
          ...a,
          unlocked: unlockedIds.has(a.id),
          unlockedAt: unlockedMap.get(a.id),
        })) || [];

        setAchievements(achievementsWithStatus);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar conquistas');
        setAchievements([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAchievements();
  }, [user]);

  const unlockAchievement = async (achievementId: string) => {
    if (!user) return;

    try {
      const { error: insertError } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_id: achievementId,
        });

      if (insertError) throw insertError;

      // Update local state
      setAchievements(prev =>
        prev.map(a =>
          a.id === achievementId
            ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
            : a
        )
      );
    } catch (err) {
      console.error('Error unlocking achievement:', err);
    }
  };

  return { achievements, loading, error, unlockAchievement };
}
