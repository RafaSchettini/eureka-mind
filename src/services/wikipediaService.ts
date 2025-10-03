import { 
  WikipediaPage, 
  WikipediaSearchResponse, 
  EducationalArticle 
} from '@/lib/wikipedia-api.types';

class WikipediaService {
  private baseUrl = 'https://en.wikipedia.org/api/rest_v1';
  private searchUrl = 'https://en.wikipedia.org/w/api.php';
  private cache = new Map<string, { data: WikipediaPage | EducationalArticle[]; timestamp: number }>();
  private cacheTimeout = 15 * 60 * 1000; // 15 minutos

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTimeout;
  }

  private setCache(key: string, data: WikipediaPage | EducationalArticle[]): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private getCache<T extends WikipediaPage | EducationalArticle[]>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data as T;
    }
    return null;
  }

  /**
   * Busca artigo específico da Wikipedia por título
   */
  async getPageSummary(title: string): Promise<WikipediaPage | null> {
    const cacheKey = `page_${title}`;
    const cached = this.getCache<WikipediaPage>(cacheKey);
    if (cached) return cached;

    try {
      const encodedTitle = encodeURIComponent(title);
      const response = await fetch(`${this.baseUrl}/page/summary/${encodedTitle}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Página não encontrada: ${title}`);
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: WikipediaPage = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar página da Wikipedia:', error);
      return null;
    }
  }

  /**
   * Busca artigos relacionados a um termo
   */
  async searchArticles(query: string, limit: number = 10): Promise<EducationalArticle[]> {
    const cacheKey = `search_${query}_${limit}`;
    const cached = this.getCache<EducationalArticle[]>(cacheKey);
    if (cached) return cached;

    try {
      const params = new URLSearchParams({
        action: 'query',
        format: 'json',
        list: 'search',
        srsearch: query,
        srlimit: limit.toString(),
        srprop: 'snippet|titlesnippet|size|timestamp',
        origin: '*'
      });

      const response = await fetch(`${this.searchUrl}?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const articles: EducationalArticle[] = [];

      if (data.query?.search) {
        for (const result of data.query.search) {
          const summary = await this.getPageSummary(result.title);
          if (summary) {
            articles.push({
              id: `wiki_${result.pageid}`,
              title: result.title,
              summary: summary.extract || result.snippet.replace(/<[^>]*>/g, ''),
              url: summary.content_urls.desktop.page,
              thumbnail: summary.thumbnail?.source,
              category: this.categorizeByTitle(result.title),
              difficulty: this.estimateDifficulty(summary.extract || ''),
              estimated_reading_time: this.estimateReadingTime(summary.extract || ''),
              source: 'wikipedia',
              created_at: result.timestamp,
              language: 'en'
            });
          }
        }
      }

      this.setCache(cacheKey, articles);
      return articles;
    } catch (error) {
      console.error('Erro ao buscar artigos da Wikipedia:', error);
      return this.getFallbackArticles(query);
    }
  }

  /**
   * Busca artigos educacionais por categoria específica
   */
  async getEducationalContent(category: string): Promise<EducationalArticle[]> {
    const topics = this.getTopicsByCategory(category);
    const allArticles: EducationalArticle[] = [];

    for (const topic of topics) {
      const articles = await this.searchArticles(topic, 3);
      allArticles.push(...articles);
    }

    return allArticles.slice(0, 12); // Limita a 12 artigos por categoria
  }

  /**
   * Mapeia categorias para tópicos relevantes
   */
  private getTopicsByCategory(category: string): string[] {
    const topicMap: Record<string, string[]> = {
      'mathematics': ['Algebra', 'Calculus', 'Statistics', 'Geometry'],
      'programming': ['Algorithm', 'Data structure', 'Software engineering', 'Programming language'],
      'science': ['Physics', 'Chemistry', 'Biology', 'Scientific method'],
      'technology': ['Artificial intelligence', 'Machine learning', 'Computer science', 'Software development'],
      'general': ['Education', 'Learning theory', 'Knowledge', 'Research']
    };

    return topicMap[category] || topicMap['general'];
  }

  /**
   * Categoriza artigo baseado no título
   */
  private categorizeByTitle(title: string): string {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('math') || titleLower.includes('algebra') || 
        titleLower.includes('calculus') || titleLower.includes('geometry')) {
      return 'mathematics';
    }
    if (titleLower.includes('program') || titleLower.includes('algorithm') || 
        titleLower.includes('software') || titleLower.includes('code')) {
      return 'programming';
    }
    if (titleLower.includes('physics') || titleLower.includes('chemistry') || 
        titleLower.includes('biology')) {
      return 'science';
    }
    if (titleLower.includes('computer') || titleLower.includes('technology') || 
        titleLower.includes('ai') || titleLower.includes('machine learning')) {
      return 'technology';
    }
    
    return 'general';
  }

  /**
   * Estima dificuldade baseada no conteúdo
   */
  private estimateDifficulty(text: string): 'easy' | 'medium' | 'hard' {
    const complexWords = ['advanced', 'complex', 'sophisticated', 'theorem', 'algorithm'];
    const basicWords = ['basic', 'simple', 'introduction', 'fundamental', 'elementary'];
    
    const textLower = text.toLowerCase();
    const complexCount = complexWords.reduce((count, word) => 
      count + (textLower.includes(word) ? 1 : 0), 0);
    const basicCount = basicWords.reduce((count, word) => 
      count + (textLower.includes(word) ? 1 : 0), 0);

    if (complexCount > basicCount) return 'hard';
    if (basicCount > complexCount) return 'easy';
    return 'medium';
  }

  /**
   * Estima tempo de leitura (palavras por minuto)
   */
  private estimateReadingTime(text: string): number {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  /**
   * Artigos de fallback para quando a API falha
   */
  private getFallbackArticles(query: string): EducationalArticle[] {
    const fallbackArticles: EducationalArticle[] = [
      {
        id: 'fallback_1',
        title: 'Introdução à Programação',
        summary: 'Programming is the process of creating a set of instructions that tell a computer how to perform a task. It involves writing code in various programming languages.',
        url: 'https://en.wikipedia.org/wiki/Computer_programming',
        category: 'programming',
        difficulty: 'easy',
        estimated_reading_time: 5,
        source: 'wikipedia',
        created_at: new Date().toISOString(),
        language: 'en'
      },
      {
        id: 'fallback_2',
        title: 'Álgebra Linear',
        summary: 'Linear algebra is the branch of mathematics concerning linear equations, linear maps, and their representations in vector spaces and through matrices.',
        url: 'https://en.wikipedia.org/wiki/Linear_algebra',
        category: 'mathematics',
        difficulty: 'medium',
        estimated_reading_time: 8,
        source: 'wikipedia',
        created_at: new Date().toISOString(),
        language: 'en'
      },
      {
        id: 'fallback_3',
        title: 'Inteligência Artificial',
        summary: 'Artificial intelligence is intelligence demonstrated by machines, in contrast to the natural intelligence displayed by humans and animals.',
        url: 'https://en.wikipedia.org/wiki/Artificial_intelligence',
        category: 'technology',
        difficulty: 'hard',
        estimated_reading_time: 12,
        source: 'wikipedia',
        created_at: new Date().toISOString(),
        language: 'en'
      }
    ];

    return fallbackArticles.filter(article => 
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.summary.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Converte Wikipedia Page para Educational Article
   */
  convertToEducationalArticle(page: WikipediaPage, category: string = 'general'): EducationalArticle {
    return {
      id: `wiki_${page.pageid}`,
      title: page.title,
      summary: page.extract,
      url: page.content_urls.desktop.page,
      thumbnail: page.thumbnail?.source,
      category,
      difficulty: this.estimateDifficulty(page.extract),
      estimated_reading_time: this.estimateReadingTime(page.extract),
      source: 'wikipedia',
      created_at: page.timestamp,
      language: page.lang
    };
  }
}

export const wikipediaService = new WikipediaService();