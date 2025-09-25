import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { RecommendationCard } from "@/components/dashboard/RecommendationCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Brain, 
  Target, 
  Trophy,
  TrendingUp,
  MessageCircle,
  Sparkles 
} from "lucide-react";

export default function Dashboard() {
  const progressData = [
    {
      title: "Cursos Concluídos",
      value: 8,
      target: 12,
      timeSpent: "45h esta semana",
      trend: 12,
      icon: <BookOpen className="w-5 h-5 text-primary" />
    },
    {
      title: "Sessões de Estudo",
      value: 24,
      target: 30,
      timeSpent: "3h hoje",
      trend: 8,
      icon: <Target className="w-5 h-5 text-secondary" />
    },
    {
      title: "Quiz Aprovado",
      value: 15,
      target: 20,
      timeSpent: "Esta semana",
      trend: 15,
      icon: <Trophy className="w-5 h-5 text-accent" />
    },
    {
      title: "Streak Atual",
      value: 7,
      timeSpent: "dias consecutivos",
      trend: 5,
      icon: <TrendingUp className="w-5 h-5 text-success" />
    }
  ];

  const recommendations = [
    {
      title: "Algoritmos de Machine Learning",
      description: "Aprenda os fundamentos de algoritmos de ML com exemplos práticos e implementações em Python.",
      type: "video" as const,
      difficulty: "intermediário" as const,
      estimatedTime: "2h 30min",
      aiRecommended: true
    },
    {
      title: "Estruturas de Dados Avançadas",
      description: "Domine árvores, grafos e outras estruturas complexas para resolver problemas algorítmicos.",
      type: "article" as const,
      difficulty: "avançado" as const,
      estimatedTime: "1h 45min"
    },
    {
      title: "Quiz: Conceitos de IA",
      description: "Teste seus conhecimentos sobre inteligência artificial e redes neurais.",
      type: "quiz" as const,
      difficulty: "iniciante" as const,
      estimatedTime: "20min",
      aiRecommended: true
    },
    {
      title: "Sessão com Tutor IA",
      description: "Revise conceitos de programação orientada a objetos com nosso tutor inteligente.",
      type: "ai" as const,
      difficulty: "intermediário" as const,
      estimatedTime: "30min"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Bem-vindo de volta! 👋
        </h1>
        <p className="text-muted-foreground">
          Continue seu progresso de aprendizado e descubra novos conteúdos recomendados.
        </p>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {progressData.map((item, index) => (
          <ProgressCard key={index} {...item} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommendations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              Recomendações Personalizadas
            </h2>
            <Button variant="outline" size="sm">
              Ver Todas
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((item, index) => (
              <RecommendationCard key={index} {...item} />
            ))}
          </div>
        </div>

        {/* Quick Actions & AI Assistant */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-primary-gradient hover:opacity-90">
                <Brain className="w-4 h-4 mr-2" />
                Conversar com Tutor IA
              </Button>
              <Button variant="outline" className="w-full">
                <BookOpen className="w-4 h-4 mr-2" />
                Continuar Último Curso
              </Button>
              <Button variant="outline" className="w-full">
                <Target className="w-4 h-4 mr-2" />
                Fazer Quiz
              </Button>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="shadow-card bg-accent-gradient text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Insights da IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/90 mb-4">
                Com base no seu desempenho, recomendamos focar em algoritmos esta semana. 
                Você tem 85% de chance de concluir o módulo até sexta-feira!
              </p>
              <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30">
                <MessageCircle className="w-4 h-4 mr-2" />
                Saiba Mais
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}