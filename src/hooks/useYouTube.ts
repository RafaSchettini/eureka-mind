import { useState, useEffect } from 'react';
import { YouTubeVideo, EducationalPlaylist } from '@/lib/youtube-api.types';
import { youtubeService } from '@/services/youtubeService';

interface UseYouTubeReturn {
  videos: YouTubeVideo[];
  playlists: EducationalPlaylist[];
  loading: boolean;
  error: string | null;
  searchVideos: (query: string) => Promise<void>;
  getPlaylistVideos: (playlistId: string) => Promise<void>;
  getVideosByCategory: (category: string) => Promise<void>;
  refreshContent: () => Promise<void>;
}

/**
 * Hook personalizado para integração com a API do YouTube
 * Substitui o useKhanAcademy com funcionalidades aprimoradas
 */
export function useYouTube(): UseYouTubeReturn {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [playlists, setPlaylists] = useState<EducationalPlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carrega playlists educacionais iniciais
   */
  const loadInitialContent = async () => {
    try {
      setLoading(true);
      setError(null);

      // Carrega playlists curadas
      const playlistsData = await youtubeService.getEducationalPlaylists();
      setPlaylists(playlistsData);

      // Carrega vídeos da primeira playlist como conteúdo inicial
      if (playlistsData.length > 0) {
        const initialVideos = await youtubeService.getPlaylistVideos(playlistsData[0].id, 15);
        setVideos(initialVideos);
      } else {
        // Fallback: busca vídeos educacionais gerais
        const fallbackVideos = await youtubeService.searchEducationalVideos('educação programação matemática', 15);
        setVideos(fallbackVideos);
      }
    } catch (err) {
      console.error('Erro ao carregar conteúdo inicial:', err);
      setError('Erro ao carregar conteúdo. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Busca vídeos por termo
   */
  const searchVideos = async (query: string) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const searchResults = await youtubeService.searchEducationalVideos(query, 20);
      setVideos(searchResults);
    } catch (err) {
      console.error('Erro na busca de vídeos:', err);
      setError('Erro na busca. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carrega vídeos de uma playlist específica
   */
  const getPlaylistVideos = async (playlistId: string) => {
    try {
      setLoading(true);
      setError(null);

      const playlistVideos = await youtubeService.getPlaylistVideos(playlistId, 30);
      setVideos(playlistVideos);
    } catch (err) {
      console.error('Erro ao carregar vídeos da playlist:', err);
      setError('Erro ao carregar playlist. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Busca vídeos por categoria educacional
   */
  const getVideosByCategory = async (category: string) => {
    try {
      setLoading(true);
      setError(null);

      const categoryVideos = await youtubeService.getVideosByCategory(category);
      setVideos(categoryVideos);
    } catch (err) {
      console.error('Erro ao carregar vídeos por categoria:', err);
      setError('Erro ao carregar categoria. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Atualiza todo o conteúdo
   */
  const refreshContent = async () => {
    await loadInitialContent();
  };

  // Carrega conteúdo inicial na montagem do componente
  useEffect(() => {
    loadInitialContent();
  }, []);

  return {
    videos,
    playlists,
    loading,
    error,
    searchVideos,
    getPlaylistVideos,
    getVideosByCategory,
    refreshContent
  };
}

/**
 * Hook simplificado para buscar apenas vídeos
 */
export function useYouTubeVideos(initialQuery?: string) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchVideos = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const results = await youtubeService.searchEducationalVideos(query);
      setVideos(results);
    } catch (err) {
      setError('Erro na busca de vídeos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      searchVideos(initialQuery);
    }
  }, [initialQuery]);

  return { videos, loading, error, searchVideos };
}

/**
 * Hook para carregar vídeos de uma playlist específica
 */
export function useYouTubePlaylist(playlistId: string) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlaylist = async () => {
      try {
        setLoading(true);
        setError(null);
        const playlistVideos = await youtubeService.getPlaylistVideos(playlistId);
        setVideos(playlistVideos);
      } catch (err) {
        setError('Erro ao carregar playlist');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (playlistId) {
      loadPlaylist();
    }
  }, [playlistId]);

  return { videos, loading, error };
}