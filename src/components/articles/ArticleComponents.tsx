import { useState } from 'react';
import { EducationalArticle } from '@/lib/wikipedia-api.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { BookOpen, ExternalLink, Clock, Search, Globe, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArticleGridProps {
  articles: EducationalArticle[];
  onArticleSelect: (article: EducationalArticle) => void;
  selectedArticle?: EducationalArticle;
  loading?: boolean;
}

export function ArticleGrid({ articles, onArticleSelect, selectedArticle, loading }: ArticleGridProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mathematics': return 'bg-blue-100 text-blue-800';
      case 'programming': return 'bg-purple-100 text-purple-800';
      case 'science': return 'bg-emerald-100 text-emerald-800';
      case 'technology': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Carregando artigos...</span>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">Nenhum artigo encontrado</h3>
        <p className="text-muted-foreground">
          Tente buscar por outros termos ou categorias.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <Card
          key={article.id}
          className={cn(
            "cursor-pointer transition-all duration-200 hover:shadow-md group",
            selectedArticle?.id === article.id && "ring-2 ring-primary"
          )}
          onClick={() => onArticleSelect(article)}
        >
          {article.thumbnail && (
            <div className="relative aspect-video bg-gray-100">
              <img
                src={article.thumbnail}
                alt={article.title}
                className="w-full h-full object-cover rounded-t-lg"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/90 rounded-full p-3">
                  <BookOpen className="w-6 h-6 text-gray-900" />
                </div>
              </div>
            </div>
          )}

          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2 mb-2">
              <Badge variant="outline" className={getCategoryColor(article.category)}>
                {article.category}
              </Badge>
              <Badge variant="outline" className={getDifficultyColor(article.difficulty)}>
                {article.difficulty}
              </Badge>
            </div>
            <CardTitle className="text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
              {article.summary}
            </p>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{article.estimated_reading_time} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                <span>Wikipedia</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Componente para exibir artigo individual
interface ArticleViewerProps {
  article: EducationalArticle;
  onBack: () => void;
}

export function ArticleViewer({ article, onBack }: ArticleViewerProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mathematics': return 'bg-blue-100 text-blue-800';
      case 'programming': return 'bg-purple-100 text-purple-800';
      case 'science': return 'bg-emerald-100 text-emerald-800';
      case 'technology': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="mb-4"
      >
        ← Voltar para artigos
      </Button>

      <Card>
        {article.thumbnail && (
          <div className="aspect-video bg-gray-100">
            <img
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-full object-cover rounded-t-lg"
            />
          </div>
        )}

        <CardHeader>
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="outline" className={getCategoryColor(article.category)}>
              {article.category}
            </Badge>
            <Badge variant="outline" className={getDifficultyColor(article.difficulty)}>
              {article.difficulty}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {article.estimated_reading_time} min de leitura
            </div>
          </div>
          
          <CardTitle className="text-2xl">{article.title}</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            {article.summary}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {article.content && (
            <div className="prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
          )}

          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="w-4 h-4" />
                <span>Fonte: Wikipedia</span>
              </div>
              
              <Button variant="outline" asChild>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ler artigo completo
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente para busca e filtros de artigos
interface ArticleFiltersProps {
  onSearch: (query: string) => void;
  onCategorySelect: (category: string) => void;
  categories: string[];
  selectedCategory?: string;
}

export function ArticleFilters({ onSearch, onCategorySelect, categories, selectedCategory }: ArticleFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const categoryLabels: Record<string, string> = {
    'mathematics': 'Matemática',
    'programming': 'Programação',
    'science': 'Ciências',
    'technology': 'Tecnologia',
    'general': 'Geral'
  };

  return (
    <div className="bg-card border rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Busca */}
        <div>
          <label className="text-sm font-medium mb-2 block">Buscar artigos</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Digite o assunto ou palavra-chave..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filtro por categoria */}
        <div>
          <label className="text-sm font-medium mb-2 block">Filtrar por categoria</label>
          <select
            value={selectedCategory || ''}
            onChange={(e) => onCategorySelect(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md text-sm"
          >
            <option value="">Todas as categorias</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {categoryLabels[category] || category}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}