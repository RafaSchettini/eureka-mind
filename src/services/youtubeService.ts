import { 
  YouTubeVideo, 
  YouTubeApiResponse, 
  YouTubeSearchResult,
  EducationalPlaylist 
} from '@/lib/youtube-api.types';

class YouTubeService {
  // Nota: Em produção, a API Key deve estar em variáveis de ambiente
  private apiKey = import.meta.env.VITE_YOUTUBE_API_KEY || 'YOUR_API_KEY_HERE';
  private baseUrl = 'https://www.googleapis.com/youtube/v3';
  private cache = new Map<string, { data: YouTubeVideo[] | EducationalPlaylist[]; timestamp: number }>();
  private cacheTimeout = 10 * 60 * 1000; // 10 minutos

  private isApiKeyConfigured(): boolean {
    return this.apiKey !== 'YOUR_API_KEY_HERE' && this.apiKey.length > 10;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTimeout;
  }

  private setCache(key: string, data: YouTubeVideo[] | EducationalPlaylist[]): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private getCache<T extends YouTubeVideo[] | EducationalPlaylist[]>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data as T;
    }
    return null;
  }

  /**
   * Busca vídeos de uma playlist específica
   */
  async getPlaylistVideos(playlistId: string, maxResults: number = 20): Promise<YouTubeVideo[]> {
    const cacheKey = `playlist_${playlistId}_${maxResults}`;
    const cached = this.getCache<YouTubeVideo[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${this.baseUrl}/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${playlistId}&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data: YouTubeApiResponse<{
        id: string;
        snippet: {
          title: string;
          description: string;
          thumbnails: {
            default?: { url: string };
            medium?: { url: string };
            high?: { url: string };
            standard?: { url: string };
            maxres?: { url: string };
          };
          resourceId: { videoId: string };
          channelId: string;
          channelTitle: string;
          publishedAt: string;
        };
      }> = await response.json();
      
      const videos: YouTubeVideo[] = data.items.map(item => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: {
          default: item.snippet.thumbnails.default?.url || '',
          medium: item.snippet.thumbnails.medium?.url || '',
          high: item.snippet.thumbnails.high?.url || '',
          standard: item.snippet.thumbnails.standard?.url,
          maxres: item.snippet.thumbnails.maxres?.url
        },
        videoId: item.snippet.resourceId?.videoId || '',
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt
      }));

      this.setCache(cacheKey, videos);
      return videos;
    } catch (error) {
      console.error('Erro ao buscar vídeos da playlist:', error);
      return this.getFallbackVideos();
    }
  }

  /**
   * Busca vídeos educacionais por termo
   */
  async searchEducationalVideos(query: string, maxResults: number = 20): Promise<YouTubeVideo[]> {
    // Verifica se a API key está configurada
    if (!this.isApiKeyConfigured()) {
      console.warn('⚠️ YouTube API Key não configurada. Usando dados de demonstração.');
      return this.getFallbackVideos(query);
    }

    const cacheKey = `search_${query}_${maxResults}`;
    const cached = this.getCache<YouTubeVideo[]>(cacheKey);
    if (cached) return cached;

    try {
      // Adiciona termos educacionais à busca para melhorar a relevância
      const educationalQuery = `${query} aula tutorial curso educativo`;
      
      const response = await fetch(
        `${this.baseUrl}/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(educationalQuery)}&type=video&videoDuration=medium&videoDefinition=high&order=relevance&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data: YouTubeApiResponse<YouTubeSearchResult> = await response.json();
      
      const videos: YouTubeVideo[] = data.items.map(item => ({
        id: item.id.videoId || '',
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: {
          default: item.snippet.thumbnails.default?.url || '',
          medium: item.snippet.thumbnails.medium?.url || '',
          high: item.snippet.thumbnails.high?.url || '',
          standard: item.snippet.thumbnails.standard?.url,
          maxres: item.snippet.thumbnails.maxres?.url
        },
        videoId: item.id.videoId || '',
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt
      }));

      this.setCache(cacheKey, videos);
      return videos;
    } catch (error) {
      console.error('Erro ao buscar vídeos educacionais:', error);
      return this.getFallbackVideos(query);
    }
  }

  /**
   * Busca playlists educacionais por categoria
   */
  async getEducationalPlaylists(): Promise<EducationalPlaylist[]> {
    const cacheKey = 'educational_playlists';
    const cached = this.getCache<EducationalPlaylist[]>(cacheKey);
    if (cached) return cached;

    // Playlists educacionais curadas manualmente
    const educationalPlaylists: EducationalPlaylist[] = [
      {
        id: 'PLkahwjBmgW4H32vjQzqpq7_kgdS8N4Ieb',
        title: 'Khan Academy - Álgebra Básica',
        description: 'Curso completo de álgebra básica com exercícios práticos',
        thumbnail: 'https://i.ytimg.com/vi/lXfEK8G8CUI/maxresdefault.jpg',
        category: 'mathematics',
        difficulty: 'beginner',
        estimatedDuration: 480, // 8 horas
        videoCount: 20,
        channelTitle: 'Khan Academy',
        subject: 'Matemática'
      },
      {
        id: 'PLHz_AreHm4dkqe2aR0tQK74m8SFe9_hQ_',
        title: 'Curso de Python - Gustavo Guanabara',
        description: 'Curso completo de Python para iniciantes',
        thumbnail: 'https://i.ytimg.com/vi/S9uPNppGsGo/maxresdefault.jpg',
        category: 'programming',
        difficulty: 'beginner',
        estimatedDuration: 2400, // 40 horas
        videoCount: 115,
        channelTitle: 'Curso em Vídeo',
        subject: 'Programação'
      },
      {
        id: 'PLvE-ZAFRgX8hnECDn1v9HNTI71veL3oW0',
        title: 'Física - Vestibular e ENEM',
        description: 'Aulas de física para vestibular e ENEM',
        thumbnail: 'https://i.ytimg.com/vi/ZM8ECpBuQYE/maxresdefault.jpg',
        category: 'science',
        difficulty: 'intermediate',
        estimatedDuration: 720, // 12 horas
        videoCount: 45,
        channelTitle: 'Professor Ferreto',
        subject: 'Física'
      },
      {
        id: 'PLcYGpOhCl1-2W6Q2TqXKJcVr5fy4h9ELv',
        title: 'Introdução à Ciência da Computação',
        description: 'Conceitos fundamentais de ciência da computação',
        thumbnail: 'https://i.ytimg.com/vi/rL8X2mlNHPM/maxresdefault.jpg',
        category: 'technology',
        difficulty: 'intermediate',
        estimatedDuration: 960, // 16 horas
        videoCount: 32,
        channelTitle: 'MIT OpenCourseWare',
        subject: 'Ciência da Computação'
      },
      {
        id: 'PLmMhL7lH8amtRJJ6-pZgJ6LwI5OO_Hl5Y',
        title: 'Química Orgânica',
        description: 'Curso completo de química orgânica',
        thumbnail: 'https://i.ytimg.com/vi/u9z6kPl0KXY/maxresdefault.jpg',
        category: 'science',
        difficulty: 'advanced',
        estimatedDuration: 600, // 10 horas
        videoCount: 25,
        channelTitle: 'Química com Prof. Paulo Valim',
        subject: 'Química'
      }
    ];

    this.setCache(cacheKey, educationalPlaylists);
    return educationalPlaylists;
  }

  /**
   * Busca vídeos por categoria educacional
   */
  async getVideosByCategory(category: string): Promise<YouTubeVideo[]> {
    // Se a API key não estiver configurada, retorna vídeos de fallback filtrados por categoria
    if (!this.isApiKeyConfigured()) {
      console.warn('⚠️ YouTube API Key não configurada. Usando dados de demonstração filtrados por categoria.');
      return this.getFallbackVideosByCategory(category);
    }

    // Se categoria está vazia, busca vídeos educacionais gerais (todas as categorias)
    if (!category || category.trim() === '') {
      return this.searchEducationalVideos('educação programação matemática ciências tecnologia', 30);
    }

    const categoryQueries = {
      'mathematics': 'matemática álgebra cálculo geometria',
      'programming': 'programação javascript python java',
      'science': 'física química biologia ciências',
      'technology': 'tecnologia computação algoritmos',
      'general': 'educação ensino aula tutorial'
    };

    const query = categoryQueries[category as keyof typeof categoryQueries] || categoryQueries.general;
    return this.searchEducationalVideos(query);
  }

  /**
   * Retorna vídeos de fallback filtrados por categoria
   */
  private getFallbackVideosByCategory(category: string): YouTubeVideo[] {
    const allVideos = this.getFallbackVideos();
    
    // Se categoria está vazia ou é 'general', retorna todos os vídeos
    if (!category || category.trim() === '' || category === 'general') {
      return allVideos;
    }
    
    const categoryKeywords = {
      'mathematics': ['matemática', 'álgebra', 'cálculo', 'math'],
      'programming': ['programação', 'javascript', 'python', 'código', 'programming'],
      'science': ['física', 'química', 'ciência', 'science'],
      'technology': ['tecnologia', 'algoritmo', 'inteligência', 'ia', 'machine']
    };

    const keywords = categoryKeywords[category as keyof typeof categoryKeywords] || [];
    
    if (keywords.length === 0) {
      return allVideos; // categoria não encontrada, retorna todos
    }

    return allVideos.filter(video => 
      keywords.some(keyword => 
        video.title.toLowerCase().includes(keyword) ||
        video.description.toLowerCase().includes(keyword) ||
        video.channelTitle.toLowerCase().includes(keyword)
      )
    );
  }

  /**
   * Gera URL do YouTube para embed
   */
  getEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  /**
   * Gera URL da thumbnail em alta qualidade
   */
  getHighQualityThumbnail(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }

  /**
   * Formata duração ISO 8601 para formato legível
   */
  formatDuration(isoDuration: string): string {
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Vídeos de fallback para quando a API falha
   */
  private getFallbackVideos(query?: string): YouTubeVideo[] {
    const fallbackVideos: YouTubeVideo[] = [
      // Programação
      {
        id: 'fallback_prog_1',
        title: 'JavaScript para Iniciantes - Aula 1',
        description: 'Aprenda JavaScript desde o básico: variáveis, funções e conceitos fundamentais da programação web.',
        thumbnail: {
          default: 'https://i.ytimg.com/vi/FCMxA3m_Imc/default.jpg',
          medium: 'https://i.ytimg.com/vi/FCMxA3m_Imc/mqdefault.jpg',
          high: 'https://i.ytimg.com/vi/FCMxA3m_Imc/hqdefault.jpg',
          maxres: 'https://i.ytimg.com/vi/FCMxA3m_Imc/maxresdefault.jpg'
        },
        videoId: 'FCMxA3m_Imc',
        channelId: 'UC_prog_1',
        channelTitle: 'Programação Web',
        publishedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'fallback_prog_2',
        title: 'Python Tutorial - Estruturas de Dados',
        description: 'Domine listas, dicionários e estruturas de dados essenciais em Python.',
        thumbnail: {
          default: 'https://i.ytimg.com/vi/8DvywoWv6fI/default.jpg',
          medium: 'https://i.ytimg.com/vi/8DvywoWv6fI/mqdefault.jpg',
          high: 'https://i.ytimg.com/vi/8DvywoWv6fI/hqdefault.jpg',
          maxres: 'https://i.ytimg.com/vi/8DvywoWv6fI/maxresdefault.jpg'
        },
        videoId: '8DvywoWv6fI',
        channelId: 'UC_prog_2',
        channelTitle: 'Python Brasil',
        publishedAt: '2024-01-05T00:00:00Z'
      },
      // Matemática
      {
        id: 'fallback_math_1',
        title: 'Álgebra Linear - Vetores e Matrizes',
        description: 'Entenda os conceitos fundamentais de vetores e operações com matrizes.',
        thumbnail: {
          default: 'https://i.ytimg.com/vi/lXfEK8G8CUI/default.jpg',
          medium: 'https://i.ytimg.com/vi/lXfEK8G8CUI/mqdefault.jpg',
          high: 'https://i.ytimg.com/vi/lXfEK8G8CUI/hqdefault.jpg',
          maxres: 'https://i.ytimg.com/vi/lXfEK8G8CUI/maxresdefault.jpg'
        },
        videoId: 'lXfEK8G8CUI',
        channelId: 'UC_math_1',
        channelTitle: 'Matemática Simples',
        publishedAt: '2024-01-02T00:00:00Z'
      },
      {
        id: 'fallback_math_2',
        title: 'Cálculo Diferencial - Derivadas',
        description: 'Aprenda conceitos de limite, continuidade e derivadas no cálculo diferencial.',
        thumbnail: {
          default: 'https://i.ytimg.com/vi/WUvTyaaNkzM/default.jpg',
          medium: 'https://i.ytimg.com/vi/WUvTyaaNkzM/mqdefault.jpg',
          high: 'https://i.ytimg.com/vi/WUvTyaaNkzM/hqdefault.jpg',
          maxres: 'https://i.ytimg.com/vi/WUvTyaaNkzM/maxresdefault.jpg'
        },
        videoId: 'WUvTyaaNkzM',
        channelId: 'UC_math_2',
        channelTitle: 'Professor Cálculo',
        publishedAt: '2024-01-08T00:00:00Z'
      },
      // Ciências
      {
        id: 'fallback_science_1',
        title: 'Física Quântica para Iniciantes',
        description: 'Uma introdução acessível aos conceitos fundamentais da mecânica quântica.',
        thumbnail: {
          default: 'https://i.ytimg.com/vi/ZM8ECpBuQYE/default.jpg',
          medium: 'https://i.ytimg.com/vi/ZM8ECpBuQYE/mqdefault.jpg',
          high: 'https://i.ytimg.com/vi/ZM8ECpBuQYE/hqdefault.jpg',
          maxres: 'https://i.ytimg.com/vi/ZM8ECpBuQYE/maxresdefault.jpg'
        },
        videoId: 'ZM8ECpBuQYE',
        channelId: 'UC_science_1',
        channelTitle: 'Ciência Fácil',
        publishedAt: '2024-01-03T00:00:00Z'
      },
      {
        id: 'fallback_science_2',
        title: 'Química Orgânica - Hidrocarbonetos',
        description: 'Estude as cadeias carbônicas e nomenclatura de compostos orgânicos.',
        thumbnail: {
          default: 'https://i.ytimg.com/vi/J0ldO87Pprc/default.jpg',
          medium: 'https://i.ytimg.com/vi/J0ldO87Pprc/mqdefault.jpg',
          high: 'https://i.ytimg.com/vi/J0ldO87Pprc/hqdefault.jpg',
          maxres: 'https://i.ytimg.com/vi/J0ldO87Pprc/maxresdefault.jpg'
        },
        videoId: 'J0ldO87Pprc',
        channelId: 'UC_science_2',
        channelTitle: 'Química Total',
        publishedAt: '2024-01-06T00:00:00Z'
      },
      // Tecnologia
      {
        id: 'fallback_tech_1',
        title: 'Inteligência Artificial - Machine Learning',
        description: 'Introdução aos algoritmos de aprendizado de máquina e redes neurais.',
        thumbnail: {
          default: 'https://i.ytimg.com/vi/aircAruvnKk/default.jpg',
          medium: 'https://i.ytimg.com/vi/aircAruvnKk/mqdefault.jpg',
          high: 'https://i.ytimg.com/vi/aircAruvnKk/hqdefault.jpg',
          maxres: 'https://i.ytimg.com/vi/aircAruvnKk/maxresdefault.jpg'
        },
        videoId: 'aircAruvnKk',
        channelId: 'UC_tech_1',
        channelTitle: 'IA Brasil',
        publishedAt: '2024-01-04T00:00:00Z'
      },
      {
        id: 'fallback_tech_2',
        title: 'Algoritmos de Ordenação - Bubble Sort',
        description: 'Entenda como funcionam os algoritmos de ordenação e sua complexidade.',
        thumbnail: {
          default: 'https://i.ytimg.com/vi/kPRA0W1kECg/default.jpg',
          medium: 'https://i.ytimg.com/vi/kPRA0W1kECg/mqdefault.jpg',
          high: 'https://i.ytimg.com/vi/kPRA0W1kECg/hqdefault.jpg',
          maxres: 'https://i.ytimg.com/vi/kPRA0W1kECg/maxresdefault.jpg'
        },
        videoId: 'kPRA0W1kECg',
        channelId: 'UC_tech_2',
        channelTitle: 'Algoritmos & Code',
        publishedAt: '2024-01-07T00:00:00Z'
      }
    ];

    // Filtra por query se fornecida
    if (query) {
      const searchTerm = query.toLowerCase();
      return fallbackVideos.filter(video => 
        video.title.toLowerCase().includes(searchTerm) ||
        video.description.toLowerCase().includes(searchTerm) ||
        video.channelTitle.toLowerCase().includes(searchTerm)
      );
    }

    return fallbackVideos;
  }
}

export const youtubeService = new YouTubeService();