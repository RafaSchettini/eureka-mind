import { 
  TriviaResponse, 
  TriviaCategoriesResponse,
  TriviaQuestion,
  TriviaCategory 
} from '@/lib/external-apis.types';

type CacheData = TriviaCategory[] | TriviaQuestion[];

class TriviaService {
  private baseUrl = 'https://opentdb.com/api.php';
  private categoriesUrl = 'https://opentdb.com/api_category.php';
  private cache = new Map<string, { data: CacheData; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutos

  private getCacheKey(params: Record<string, string | number | undefined>): string {
    return JSON.stringify(params);
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTimeout;
  }

  private setCache(key: string, data: CacheData): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private getCache<T extends CacheData>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data as T;
    }
    return null;
  }

  /**
   * Busca categorias disponíveis no Open Trivia Database
   */
  async getCategories(): Promise<TriviaCategory[]> {
    const cacheKey = 'trivia_categories';
    const cached = this.getCache<TriviaCategory[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(this.categoriesUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: TriviaCategoriesResponse = await response.json();
      this.setCache(cacheKey, data.trivia_categories);
      return data.trivia_categories;
    } catch (error) {
      console.error('Erro ao buscar categorias do Trivia:', error);
      
      // Fallback com categorias populares
      const fallbackCategories: TriviaCategory[] = [
        { id: 9, name: "General Knowledge" },
        { id: 18, name: "Science: Computers" },
        { id: 19, name: "Science: Mathematics" },
        { id: 21, name: "Sports" },
        { id: 22, name: "Geography" },
        { id: 23, name: "History" },
        { id: 27, name: "Animals" },
      ];
      
      return fallbackCategories;
    }
  }

  /**
   * Busca questões do Open Trivia Database
   */
  async getQuestions(params: {
    amount?: number;
    category?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    type?: 'multiple' | 'boolean';
  } = {}): Promise<TriviaQuestion[]> {
    const {
      amount = 10,
      category,
      difficulty,
      type = 'multiple'
    } = params;

    const cacheKey = this.getCacheKey(params);
    const cached = this.getCache<TriviaQuestion[]>(cacheKey);
    if (cached) return cached;

    try {
      const urlParams = new URLSearchParams({
        amount: amount.toString(),
        type,
        ...(category && { category: category.toString() }),
        ...(difficulty && { difficulty }),
      });

      const response = await fetch(`${this.baseUrl}?${urlParams}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TriviaResponse = await response.json();
      
      if (data.response_code !== 0) {
        throw new Error(`Trivia API error code: ${data.response_code}`);
      }

      // Decodifica entidades HTML nas perguntas e respostas
      const decodedQuestions = data.results.map(question => ({
        ...question,
        question: this.decodeHtml(question.question),
        correct_answer: this.decodeHtml(question.correct_answer),
        incorrect_answers: question.incorrect_answers.map(answer => this.decodeHtml(answer))
      }));

      this.setCache(cacheKey, decodedQuestions);
      return decodedQuestions;
    } catch (error) {
      console.error('Erro ao buscar questões do Trivia:', error);
      
      // Fallback com questões de exemplo
      const fallbackQuestions: TriviaQuestion[] = [
        {
          category: "Science: Computers",
          type: "multiple",
          difficulty: "easy",
          question: "O que significa a sigla 'HTML'?",
          correct_answer: "HyperText Markup Language",
          incorrect_answers: [
            "Home Tool Markup Language",
            "Hyperlinks and Text Markup Language",
            "HyperTool Markup Language"
          ]
        },
        {
          category: "Science: Computers",
          type: "multiple",
          difficulty: "easy",
          question: "Qual é a linguagem de programação mais popular para desenvolvimento web?",
          correct_answer: "JavaScript",
          incorrect_answers: ["Python", "Java", "C++"]
        }
      ];
      
      return fallbackQuestions;
    }
  }

  /**
   * Decodifica entidades HTML
   */
  private decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  /**
   * Embaralha as opções de resposta
   */
  shuffleAnswers(question: TriviaQuestion): string[] {
    const allAnswers = [question.correct_answer, ...question.incorrect_answers];
    return allAnswers.sort(() => Math.random() - 0.5);
  }

  /**
   * Verifica se a resposta está correta
   */
  checkAnswer(question: TriviaQuestion, selectedAnswer: string): boolean {
    return question.correct_answer === selectedAnswer;
  }

  /**
   * Calcula pontuação baseada na dificuldade
   */
  calculateScore(difficulty: string): number {
    switch (difficulty) {
      case 'easy': return 10;
      case 'medium': return 20;
      case 'hard': return 30;
      default: return 10;
    }
  }
}

export const triviaService = new TriviaService();