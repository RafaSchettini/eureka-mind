// Tipos para Khan Academy API
export interface KhanAcademyVideo {
  id: string;
  title: string;
  description: string;
  youtube_id: string;
  duration: number;
  topic_slug: string;
  domain_slug: string;
  subject_slug: string;
  thumbnail_url: string;
  download_urls?: {
    mp4?: string;
    mp4_low?: string;
  };
}

export interface KhanAcademyTopic {
  id: string;
  title: string;
  description: string;
  slug: string;
  kind: string;
  children?: KhanAcademyTopic[];
  videos?: KhanAcademyVideo[];
}

// Tipos para Open Trivia Database
export interface TriviaQuestion {
  category: string;
  type: 'multiple' | 'boolean';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface TriviaResponse {
  response_code: number;
  results: TriviaQuestion[];
}

export interface TriviaCategory {
  id: number;
  name: string;
}

export interface TriviaCategoriesResponse {
  trivia_categories: TriviaCategory[];
}

// Tipos para nossa aplicação
export interface QuizAttempt {
  id: string;
  user_id: string;
  questions: TriviaQuestion[];
  answers: QuizAnswer[];
  score: number;
  total_questions: number;
  completed_at: string;
  category: string;
  difficulty: string;
}

export interface QuizAnswer {
  question_index: number;
  selected_answer: string;
  correct_answer: string;
  is_correct: boolean;
  time_spent: number; // em segundos
}

export interface ExternalContent {
  id: string;
  type: 'khan_academy' | 'trivia_quiz';
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimated_duration: number; // em minutos
  thumbnail_url?: string;
  source_url?: string;
  metadata: {
    youtube_id?: string;
    trivia_category?: number;
    question_count?: number;
  };
}