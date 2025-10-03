import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Play,
  FileText,
  Search,
  Clock,
  Star,
  Loader2,
  Target,
  GraduationCap,
  Brain,
  Globe
} from "lucide-react";
import heroImage from "@/assets/hero-platform.jpg";
import { useContents } from "@/hooks/useContents";
import { useUserProgress } from "@/hooks/useProgress";
import { useYouTube } from "@/hooks/useYouTube";
import { useTrivia } from "@/hooks/useTrivia";
import { useWikipedia } from "@/hooks/useWikipedia";
import { Tables } from "@/integrations/supabase/types";
import { YouTubeVideoPlayer, YouTubeVideoGrid, YouTubeVideoFilters } from "@/components/videos/YouTubePlayer";
import { QuizSetup } from "@/components/quiz/QuizSetup";
import { QuizPlayer, QuizResults } from "@/components/quiz/QuizPlayer";
import { ArticleGrid, ArticleViewer, ArticleFilters } from "@/components/articles/ArticleComponents";
import { YouTubeVideo, EducationalPlaylist } from "@/lib/youtube-api.types";
import { TriviaQuestion, QuizAttempt } from "@/lib/external-apis.types";
import { EducationalArticle } from "@/lib/wikipedia-api.types";

type Content = Tables<'contents'>;

export default function Content() {
  // Estados para YouTube
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [videoSearchTerm, setVideoSearchTerm] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState<EducationalPlaylist | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("programming");

  // Estados para Quiz
  const [quizState, setQuizState] = useState<'setup' | 'playing' | 'results'>('setup');
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState<TriviaQuestion[]>([]);
  const [quizResult, setQuizResult] = useState<QuizAttempt | null>(null);

  // Estados para artigos Wikipedia
  const [selectedArticle, setSelectedArticle] = useState<EducationalArticle | null>(null);
  const [selectedArticleCategory, setSelectedArticleCategory] = useState<string>('mathematics');

  const { updateProgress } = useUserProgress();

  // YouTube hooks
  const {
    videos,
    playlists,
    loading: youtubeLoading,
    searchVideos,
    getPlaylistVideos,
    getVideosByCategory,
    refreshContent
  } = useYouTube();

  // Trivia hooks
  const {
    categories,
    loading: triviaLoading
  } = useTrivia();

  // Wikipedia hooks
  const {
    articles,
    loading: wikiLoading,
    searchArticles,
    getEducationalContent,
    getAllEducationalContent
  } = useWikipedia();

  // Handlers para YouTube
  const handleVideoSearch = (query: string) => {
    setVideoSearchTerm(query);
    if (query.trim()) {
      searchVideos(query);
    }
  };

  const handlePlaylistSelect = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    setSelectedPlaylist(playlist || null);
    if (playlistId) {
      getPlaylistVideos(playlistId);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    if (category && category.trim() !== '') {
      // Categoria específica selecionada
      getVideosByCategory(category);
    } else {
      // "Todas as categorias" selecionada - carrega conteúdo inicial (todos os vídeos)
      refreshContent();
    }
  };

  // Handlers para Quiz
  const handleStartQuiz = (questions: TriviaQuestion[]) => {
    setCurrentQuizQuestions(questions);
    setQuizState('playing');
  };

  const handleQuizComplete = (attempt: QuizAttempt) => {
    setQuizResult(attempt);
    setQuizState('results');
    // Aqui você pode salvar o resultado no Supabase
    console.log('Quiz finalizado:', attempt);
  };

  const handleQuizRestart = () => {
    setQuizState('setup');
    setQuizResult(null);
    setCurrentQuizQuestions([]);
  };

  const handleQuizExit = () => {
    setQuizState('setup');
    setCurrentQuizQuestions([]);
  };

  // Handlers para Wikipedia
  const handleArticleSearch = async (query: string) => {
    if (query.trim()) {
      await searchArticles(query);
    } else if (selectedArticleCategory) {
      await getEducationalContent(selectedArticleCategory);
    }
  };

  const handleArticleCategorySelect = async (category: string) => {
    setSelectedArticleCategory(category);
    if (category && category.trim() !== '') {
      // Categoria específica selecionada
      await getEducationalContent(category);
    } else {
      // "Todas as categorias" selecionada - carrega artigos de todas as categorias
      await getAllEducationalContent();
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative h-48 rounded-lg overflow-hidden">
        <img
          src={heroImage}
          alt="Plataforma de Estudos"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold mb-2">Centro de Conteúdos</h1>
            <p className="text-lg opacity-90">
              Explore materiais de estudo, vídeos educacionais e quizzes interativos
            </p>
          </div>
        </div>
      </div>

      {/* Tabs para diferentes tipos de conteúdo */}
      <Tabs defaultValue="estudos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="estudos" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Estudos
          </TabsTrigger>
          <TabsTrigger value="questoes" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Questões
          </TabsTrigger>
        </TabsList>

        {/* Aba de Estudos (Vídeos + Artigos) */}
        <TabsContent value="estudos" className="space-y-6">
          <Tabs defaultValue="videos" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="videos" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Vídeoaulas
              </TabsTrigger>
              <TabsTrigger value="artigos" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Artigos
              </TabsTrigger>
            </TabsList>

            {/* Sub-aba de Vídeos */}
            <TabsContent value="videos" className="space-y-6">
              {selectedVideo ? (
                <div className="space-y-6">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedVideo(null)}
                    className="mb-4"
                  >
                    ← Voltar para vídeos
                  </Button>
                  <YouTubeVideoPlayer
                    video={selectedVideo}
                    autoplay={false}
                  />
                </div>
              ) : (
                <>
                  <YouTubeVideoFilters
                    onSearch={handleVideoSearch}
                    onCategorySelect={handleCategorySelect}
                    onPlaylistSelect={handlePlaylistSelect}
                    categories={['mathematics', 'programming', 'science', 'technology', 'general']}
                    playlists={playlists.map(p => ({ id: p.id, title: p.title, subject: p.subject }))}
                    selectedCategory={selectedCategory}
                    selectedPlaylist={selectedPlaylist?.id}
                  />

                  {youtubeLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <span className="ml-2 text-muted-foreground">Carregando vídeos...</span>
                    </div>
                  ) : (
                    <YouTubeVideoGrid
                      videos={videos}
                      onVideoSelect={setSelectedVideo}
                      loading={youtubeLoading}
                    />
                  )}
                </>
              )}
            </TabsContent>

            {/* Sub-aba de Artigos */}
            <TabsContent value="artigos" className="space-y-6">
              {selectedArticle ? (
                <ArticleViewer
                  article={selectedArticle}
                  onBack={() => setSelectedArticle(null)}
                />
              ) : (
                <>
                  <ArticleFilters
                    onSearch={handleArticleSearch}
                    onCategorySelect={handleArticleCategorySelect}
                    categories={['mathematics', 'programming', 'science', 'technology', 'general']}
                    selectedCategory={selectedArticleCategory}
                  />

                  <ArticleGrid
                    articles={articles}
                    onArticleSelect={setSelectedArticle}
                    selectedArticle={selectedArticle || undefined}
                    loading={wikiLoading}
                  />
                </>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Aba de Questões (Quiz de Revisão) */}
        <TabsContent value="questoes" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">🎯 Questões de Revisão</h2>
            <p className="text-muted-foreground">
              Teste seus conhecimentos com quizzes interativos sobre os assuntos estudados
            </p>
          </div>

          {quizState === 'setup' && (
            <QuizSetup onStartQuiz={handleStartQuiz} />
          )}

          {quizState === 'playing' && (
            <QuizPlayer
              questions={currentQuizQuestions}
              onQuizComplete={handleQuizComplete}
              onQuizExit={handleQuizExit}
            />
          )}

          {quizState === 'results' && quizResult && (
            <QuizResults
              attempt={quizResult}
              onRestart={handleQuizRestart}
              onExit={handleQuizExit}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
