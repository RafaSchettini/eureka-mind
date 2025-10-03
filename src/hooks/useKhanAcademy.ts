import { useState, useEffect } from 'react';
import { khanAcademyService } from '@/services/khanAcademyService';
import { KhanAcademyVideo, KhanAcademyTopic } from '@/lib/external-apis.types';

export function useKhanAcademy() {
  const [topics, setTopics] = useState<KhanAcademyTopic[]>([]);
  const [videos, setVideos] = useState<KhanAcademyVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await khanAcademyService.getTopics();
      setTopics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tópicos');
    } finally {
      setLoading(false);
    }
  };

  const fetchVideosByTopic = async (topicSlug: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await khanAcademyService.getVideosByTopic(topicSlug);
      setVideos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar vídeos');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await khanAcademyService.getAllVideos();
      setVideos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar vídeos');
    } finally {
      setLoading(false);
    }
  };

  const searchVideos = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await khanAcademyService.searchVideos(query);
      setVideos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar vídeos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  return {
    topics,
    videos,
    loading,
    error,
    fetchTopics,
    fetchVideosByTopic,
    fetchAllVideos,
    searchVideos,
    getEmbedUrl: khanAcademyService.getEmbedUrl,
    formatDuration: khanAcademyService.formatDuration,
    getHighQualityThumbnail: khanAcademyService.getHighQualityThumbnail
  };
}