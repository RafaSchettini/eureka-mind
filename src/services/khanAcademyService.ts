import { 
  KhanAcademyVideo, 
  KhanAcademyTopic 
} from '@/lib/external-apis.types';

class KhanAcademyService {
  private cache = new Map<string, { data: KhanAcademyVideo[] | KhanAcademyTopic[]; timestamp: number }>();
  private cacheTimeout = 10 * 60 * 1000; // 10 minutos

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTimeout;
  }

  private setCache(key: string, data: KhanAcademyVideo[] | KhanAcademyTopic[]): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private getCache<T extends KhanAcademyVideo[] | KhanAcademyTopic[]>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data as T;
    }
    return null;
  }

  /**
   * Busca tópicos educacionais
   * Como a API real da Khan Academy tem limitações, vamos simular com dados educacionais
   */
  async getTopics(): Promise<KhanAcademyTopic[]> {
    const cacheKey = 'khan_topics';
    const cached = this.getCache<KhanAcademyTopic[]>(cacheKey);
    if (cached) return cached;

    // Simulação de dados educacionais da Khan Academy
    const topics: KhanAcademyTopic[] = [
      {
        id: 'math-basics',
        title: 'Matemática Básica',
        description: 'Fundamentos da matemática: aritmética, álgebra e geometria',
        slug: 'math-basics',
        kind: 'Topic'
      },
      {
        id: 'programming',
        title: 'Introdução à Programação',
        description: 'Conceitos básicos de programação e pensamento computacional',
        slug: 'programming',
        kind: 'Topic'
      },
      {
        id: 'physics',
        title: 'Física',
        description: 'Leis fundamentais da física e suas aplicações',
        slug: 'physics',
        kind: 'Topic'
      },
      {
        id: 'biology',
        title: 'Biologia',
        description: 'Estudo da vida e dos organismos vivos',
        slug: 'biology',
        kind: 'Topic'
      },
      {
        id: 'chemistry',
        title: 'Química',
        description: 'Estrutura, propriedades e transformações da matéria',
        slug: 'chemistry',
        kind: 'Topic'
      }
    ];

    this.setCache(cacheKey, topics);
    return topics;
  }

  /**
   * Busca vídeos por tópico
   */
  async getVideosByTopic(topicSlug: string): Promise<KhanAcademyVideo[]> {
    const cacheKey = `khan_videos_${topicSlug}`;
    const cached = this.getCache<KhanAcademyVideo[]>(cacheKey);
    if (cached) return cached;

    // Simulação de vídeos educacionais baseados no YouTube
    const videosByTopic: Record<string, KhanAcademyVideo[]> = {
      'math-basics': [
        {
          id: 'algebra-intro',
          title: 'Introdução à Álgebra',
          description: 'Entenda os conceitos básicos de variáveis, expressões e equações algébricas.',
          youtube_id: 'lXfEK8G8CUI', // Vídeo real do Khan Academy no YouTube
          duration: 720, // 12 minutos
          topic_slug: 'math-basics',
          domain_slug: 'math',
          subject_slug: 'algebra',
          thumbnail_url: 'https://img.youtube.com/vi/lXfEK8G8CUI/maxresdefault.jpg'
        },
        {
          id: 'fractions-intro',
          title: 'Introdução às Frações',
          description: 'Aprenda a trabalhar com frações: soma, subtração, multiplicação e divisão.',
          youtube_id: 'uWrbXTNjZL8',
          duration: 960, // 16 minutos
          topic_slug: 'math-basics',
          domain_slug: 'math',
          subject_slug: 'arithmetic',
          thumbnail_url: 'https://img.youtube.com/vi/uWrbXTNjZL8/maxresdefault.jpg'
        }
      ],
      'programming': [
        {
          id: 'programming-intro',
          title: 'O que é Programação?',
          description: 'Uma introdução ao mundo da programação e desenvolvimento de software.',
          youtube_id: 'FCMxA3m_Imc',
          duration: 600, // 10 minutos
          topic_slug: 'programming',
          domain_slug: 'computing',
          subject_slug: 'programming-intro',
          thumbnail_url: 'https://img.youtube.com/vi/FCMxA3m_Imc/maxresdefault.jpg'
        },
        {
          id: 'algorithms-intro',
          title: 'Introdução aos Algoritmos',
          description: 'Entenda o que são algoritmos e como eles funcionam na programação.',
          youtube_id: 'rL8X2mlNHPM',
          duration: 840, // 14 minutos
          topic_slug: 'programming',
          domain_slug: 'computing',
          subject_slug: 'algorithms',
          thumbnail_url: 'https://img.youtube.com/vi/rL8X2mlNHPM/maxresdefault.jpg'
        }
      ],
      'physics': [
        {
          id: 'motion-intro',
          title: 'Introdução ao Movimento',
          description: 'Conceitos básicos de movimento, velocidade e aceleração.',
          youtube_id: 'ZM8ECpBuQYE',
          duration: 780, // 13 minutos
          topic_slug: 'physics',
          domain_slug: 'science',
          subject_slug: 'physics-motion',
          thumbnail_url: 'https://img.youtube.com/vi/ZM8ECpBuQYE/maxresdefault.jpg'
        }
      ],
      'biology': [
        {
          id: 'cells-intro',
          title: 'Introdução às Células',
          description: 'Conheça a unidade básica da vida: a célula.',
          youtube_id: 'Hmwvj9X4GNY',
          duration: 660, // 11 minutos
          topic_slug: 'biology',
          domain_slug: 'science',
          subject_slug: 'cells',
          thumbnail_url: 'https://img.youtube.com/vi/Hmwvj9X4GNY/maxresdefault.jpg'
        }
      ],
      'chemistry': [
        {
          id: 'atoms-intro',
          title: 'Introdução aos Átomos',
          description: 'Entenda a estrutura básica da matéria: prótons, nêutrons e elétrons.',
          youtube_id: 'u9z6kPl0KXY',
          duration: 900, // 15 minutos
          topic_slug: 'chemistry',
          domain_slug: 'science',
          subject_slug: 'atoms',
          thumbnail_url: 'https://img.youtube.com/vi/u9z6kPl0KXY/maxresdefault.jpg'
        }
      ]
    };

    const videos = videosByTopic[topicSlug] || [];
    this.setCache(cacheKey, videos);
    return videos;
  }

  /**
   * Busca todos os vídeos disponíveis
   */
  async getAllVideos(): Promise<KhanAcademyVideo[]> {
    const topics = await this.getTopics();
    const allVideos: KhanAcademyVideo[] = [];

    for (const topic of topics) {
      const videos = await this.getVideosByTopic(topic.slug);
      allVideos.push(...videos);
    }

    return allVideos;
  }

  /**
   * Busca vídeos por termo de pesquisa
   */
  async searchVideos(query: string): Promise<KhanAcademyVideo[]> {
    const allVideos = await this.getAllVideos();
    const searchTerm = query.toLowerCase();

    return allVideos.filter(video => 
      video.title.toLowerCase().includes(searchTerm) ||
      video.description.toLowerCase().includes(searchTerm) ||
      video.topic_slug.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Gera URL do YouTube para embed
   */
  getEmbedUrl(youtubeId: string): string {
    return `https://www.youtube.com/embed/${youtubeId}`;
  }

  /**
   * Formata duração em minutos
   */
  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  /**
   * Obtém a URL da thumbnail em alta qualidade
   */
  getHighQualityThumbnail(youtubeId: string): string {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  }
}

export const khanAcademyService = new KhanAcademyService();