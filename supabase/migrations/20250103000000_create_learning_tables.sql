-- Create contents table for learning materials
CREATE TABLE public.contents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('video', 'article', 'pdf', 'quiz')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('iniciante', 'intermediário', 'avançado')),
  duration TEXT NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  thumbnail_url TEXT,
  content_url TEXT,
  subject TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_progress table to track learning progress
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  time_spent_minutes INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, content_id)
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  criteria_type TEXT NOT NULL,
  criteria_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_achievements table to track unlocked achievements
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create study_sessions table to track study time
CREATE TABLE public.study_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES public.contents(id) ON DELETE SET NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ai_conversations table to store chat history
CREATE TABLE public.ai_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ai_messages table to store individual messages
CREATE TABLE public.ai_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'ai')),
  content TEXT NOT NULL,
  suggestions TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for contents (public read, admin write)
CREATE POLICY "Contents are viewable by everyone" 
ON public.contents FOR SELECT USING (true);

-- Create policies for user_progress
CREATE POLICY "Users can view their own progress" 
ON public.user_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for achievements (public read)
CREATE POLICY "Achievements are viewable by everyone" 
ON public.achievements FOR SELECT USING (true);

-- Create policies for user_achievements
CREATE POLICY "Users can view their own achievements" 
ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" 
ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for study_sessions
CREATE POLICY "Users can view their own study sessions" 
ON public.study_sessions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own study sessions" 
ON public.study_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study sessions" 
ON public.study_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for ai_conversations
CREATE POLICY "Users can view their own conversations" 
ON public.ai_conversations FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations" 
ON public.ai_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" 
ON public.ai_conversations FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations" 
ON public.ai_conversations FOR DELETE USING (auth.uid() = user_id);

-- Create policies for ai_messages
CREATE POLICY "Users can view messages from their conversations" 
ON public.ai_messages FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.ai_conversations 
  WHERE ai_conversations.id = ai_messages.conversation_id 
  AND ai_conversations.user_id = auth.uid()
));

CREATE POLICY "Users can insert messages to their conversations" 
ON public.ai_messages FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.ai_conversations 
  WHERE ai_conversations.id = ai_messages.conversation_id 
  AND ai_conversations.user_id = auth.uid()
));

-- Create triggers for updated_at columns
CREATE TRIGGER update_contents_updated_at
BEFORE UPDATE ON public.contents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
BEFORE UPDATE ON public.user_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_conversations_updated_at
BEFORE UPDATE ON public.ai_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample achievements
INSERT INTO public.achievements (title, description, criteria_type, criteria_value) VALUES
  ('Primeira Semana', 'Complete 7 dias consecutivos de estudo', 'study_streak', 7),
  ('Quiz Master', 'Acerte 10 quizzes seguidos', 'quiz_streak', 10),
  ('IA Expert', 'Use o tutor IA por 5 horas', 'ai_usage_hours', 5),
  ('Estudioso', 'Complete 50 sessões de estudo', 'study_sessions', 50),
  ('Maratonista', 'Estude por 100 horas', 'total_study_hours', 100),
  ('Iniciante Dedicado', 'Complete 5 cursos para iniciantes', 'beginner_courses', 5),
  ('Intermediário Avançado', 'Complete 5 cursos intermediários', 'intermediate_courses', 5),
  ('Expert em IA', 'Complete todos os cursos de Inteligência Artificial', 'ai_courses', 10);

-- Insert sample contents
INSERT INTO public.contents (title, description, type, difficulty, duration, rating, subject, tags) VALUES
  ('Introdução à Inteligência Artificial', 'Conceitos fundamentais de IA, história e aplicações práticas no mundo moderno.', 'video', 'iniciante', '45min', 4.8, 'Inteligência Artificial', ARRAY['IA', 'fundamentos', 'iniciante']),
  ('Estruturas de Dados em Python', 'Aprenda listas, tuplas, dicionários e sets com exemplos práticos e exercícios.', 'article', 'intermediário', '30min', 4.6, 'Programação', ARRAY['Python', 'estruturas de dados', 'programação']),
  ('Algoritmos de Machine Learning', 'Guia completo sobre algoritmos de ML: regressão, classificação e clustering.', 'pdf', 'avançado', '2h', 4.9, 'Machine Learning', ARRAY['ML', 'algoritmos', 'avançado']),
  ('Desenvolvimento Web com React', 'Curso prático de React desde o básico até conceitos avançados como hooks e context.', 'video', 'intermediário', '3h 20min', 4.7, 'Desenvolvimento Web', ARRAY['React', 'web', 'frontend']),
  ('Banco de Dados SQL', 'Fundamentos de SQL, consultas avançadas e design de banco de dados relacionais.', 'article', 'iniciante', '1h 15min', 4.5, 'Banco de Dados', ARRAY['SQL', 'database', 'backend']),
  ('Deep Learning e Redes Neurais', 'Conceitos avançados de deep learning, CNN, RNN e transformers.', 'pdf', 'avançado', '4h', 4.8, 'Deep Learning', ARRAY['deep learning', 'neural networks', 'IA']);
