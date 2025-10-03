import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { mockContents } from '@/lib/mockData';

type Content = Tables<'contents'>;
type ContentDifficulty = 'iniciante' | 'intermediário' | 'avançado';
type ContentType = 'video' | 'article' | 'pdf' | 'quiz';

export function useContents(searchTerm?: string, filterDifficulty?: string, filterType?: string) {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContents() {
      try {
        setLoading(true);
        let query = supabase
          .from('contents')
          .select('*')
          .order('created_at', { ascending: false });

        // Apply search filter
        if (searchTerm) {
          query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
        }

        // Apply difficulty filter
        if (filterDifficulty && filterDifficulty !== 'all') {
          query = query.eq('difficulty', filterDifficulty as ContentDifficulty);
        }

        // Apply type filter
        if (filterType && filterType !== 'all') {
          query = query.eq('type', filterType as ContentType);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          // Use mock data if Supabase connection fails
          console.warn('Using mock data:', fetchError.message);
          let filteredData = [...mockContents];

          // Apply filters to mock data
          if (searchTerm) {
            filteredData = filteredData.filter(item =>
              item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }

          if (filterDifficulty && filterDifficulty !== 'all') {
            filteredData = filteredData.filter(item => item.difficulty === filterDifficulty);
          }

          if (filterType && filterType !== 'all') {
            filteredData = filteredData.filter(item => item.type === filterType);
          }

          setContents(filteredData as Content[]);
          setError(null);
        } else {
          setContents(data || []);
          setError(null);
        }
      } catch (err) {
        // Fallback to mock data on any error
        console.warn('Using mock data due to error:', err);
        let filteredData = [...mockContents];

        // Apply filters to mock data
        if (searchTerm) {
          filteredData = filteredData.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        if (filterDifficulty && filterDifficulty !== 'all') {
          filteredData = filteredData.filter(item => item.difficulty === filterDifficulty);
        }

        if (filterType && filterType !== 'all') {
          filteredData = filteredData.filter(item => item.type === filterType);
        }

        setContents(filteredData as Content[]);
        setError(null);
      } finally {
        setLoading(false);
      }
    }

    fetchContents();
  }, [searchTerm, filterDifficulty, filterType]);

  return { contents, loading, error };
}

export function useContentById(id: string) {
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('contents')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        setContent(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar conteúdo');
        setContent(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchContent();
    }
  }, [id]);

  return { content, loading, error };
}
