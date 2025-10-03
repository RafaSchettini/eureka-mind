// Tipos para Wikipedia API
export interface WikipediaPage {
  type: string;
  title: string;
  displaytitle: string;
  pageid: number;
  extract: string;
  extract_html?: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  originalimage?: {
    source: string;
    width: number;
    height: number;
  };
  content_urls: {
    desktop: {
      page: string;
      revisions: string;
      edit: string;
      talk: string;
    };
    mobile: {
      page: string;
      revisions: string;
      edit: string;
      talk: string;
    };
  };
  lang: string;
  dir: string;
  timestamp: string;
}

export interface WikipediaSearchResult {
  id: number;
  key: string;
  title: string;
  excerpt: string;
  description?: string;
  thumbnail?: {
    mimetype: string;
    width: number;
    height: number;
    duration?: number;
    url: string;
  };
}

export interface WikipediaSearchResponse {
  pages: WikipediaSearchResult[];
}

// Tipos para nossa aplicação
export interface EducationalArticle {
  id: string;
  title: string;
  summary: string;
  content?: string;
  url: string;
  thumbnail?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimated_reading_time: number; // em minutos
  source: 'wikipedia' | 'custom';
  created_at: string;
  language: string;
}