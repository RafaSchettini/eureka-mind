import { useState, useEffect } from 'react';
import { wikipediaService } from '@/services/wikipediaService';
import { EducationalArticle } from '@/lib/wikipedia-api.types';

export function useWikipedia() {
  const [articles, setArticles] = useState<EducationalArticle[]>([]);
  const [loading, setLoading] = useState(true); // Inicia como true para carregar conteúdo inicial
  const [error, setError] = useState<string | null>(null);

  // Carrega conteúdo inicial na montagem do componente
  useEffect(() => {
    const loadInitialContent = async () => {
      try {
        setLoading(true);
        setError(null);
        // Carrega artigos da categoria 'mathematics' como conteúdo inicial
        const initialArticles = await wikipediaService.getEducationalContent('mathematics');
        setArticles(initialArticles);
      } catch (err) {
        setError('Erro ao carregar conteúdo inicial');
        console.error('Erro ao carregar conteúdo inicial:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialContent();
  }, []);

  const searchArticles = async (query: string, limit: number = 10) => {
    try {
      setLoading(true);
      setError(null);
      const results = await wikipediaService.searchArticles(query, limit);
      setArticles(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar artigos');
    } finally {
      setLoading(false);
    }
  };

  const getEducationalContent = async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      const results = await wikipediaService.getEducationalContent(category);
      setArticles(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar conteúdo educacional');
    } finally {
      setLoading(false);
    }
  };

  const getAllEducationalContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const categories = ['mathematics', 'programming', 'science', 'technology'];
      const allArticles: EducationalArticle[] = [];
      
      for (const category of categories) {
        const categoryArticles = await wikipediaService.getEducationalContent(category);
        allArticles.push(...categoryArticles);
      }
      
      // Remove duplicatas por título e limita o total
      const uniqueArticles = allArticles.filter((article, index, self) => 
        index === self.findIndex(a => a.title === article.title)
      ).slice(0, 20);
      
      setArticles(uniqueArticles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar todo o conteúdo educacional');
    } finally {
      setLoading(false);
    }
  };

  const getPageSummary = async (title: string) => {
    try {
      setLoading(true);
      setError(null);
      const page = await wikipediaService.getPageSummary(title);
      if (page) {
        const article = wikipediaService.convertToEducationalArticle(page);
        return article;
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar página');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearArticles = () => {
    setArticles([]);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    articles,
    loading,
    error,
    searchArticles,
    getEducationalContent,
    getAllEducationalContent,
    getPageSummary,
    clearArticles,
    clearError
  };
}