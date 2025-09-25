import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Target, 
  Calendar,
  Award,
  Brain,
  BookOpen,
  Clock,
  Trophy
} from "lucide-react";

export default function ProgressPage() {
  const weeklyProgress = [
    { day: "Seg", completed: 3, goal: 4 },
    { day: "Ter", completed: 4, goal: 4 },
    { day: "Qua", completed: 2, goal: 4 },
    { day: "Qui", completed: 4, goal: 4 },
    { day: "Sex", completed: 3, goal: 4 },
    { day: "Sáb", completed: 1, goal: 2 },
    { day: "Dom", completed: 2, goal: 2 }
  ];

  const achievements = [
    { title: "Primeira Semana", description: "Complete 7 dias consecutivos", unlocked: true },
    { title: "Quiz Master", description: "Acerte 10 quizzes seguidos", unlocked: true },
    { title: "IA Expert", description: "Use o tutor IA por 5 horas", unlocked: false },
    { title: "Estudioso", description: "Complete 50 sessões de estudo", unlocked: false }
  ];

  const subjects = [
    { name: "Inteligência Artificial", progress: 85, timeSpent: "24h", completed: 8, total: 10 },
    { name: "Estruturas de Dados", progress: 60, timeSpent: "18h", completed: 6, total: 10 },
    { name: "Machine Learning", progress: 45, timeSpent: "12h", completed: 4, total: 9 },
    { name: "Desenvolvimento Web", progress: 30, timeSpent: "8h", completed: 3, total: 10 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-primary" />
          Progresso de Estudos
        </h1>
        <p className="text-muted-foreground">
          Acompanhe seu desenvolvimento e conquistas de aprendizado.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">21</p>
                <p className="text-sm text-muted-foreground">Sessões esta semana</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <Clock className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">45h</p>
                <p className="text-sm text-muted-foreground">Tempo total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Brain className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">89%</p>
                <p className="text-sm text-muted-foreground">Taxa de conclusão</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <Trophy className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-sm text-muted-foreground">Conquistas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Progress */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Progresso Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyProgress.map((day, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="w-8 text-sm font-medium text-muted-foreground">
                      {day.day}
                    </span>
                    <div className="flex-1">
                      <Progress 
                        value={(day.completed / day.goal) * 100} 
                        className="h-3"
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {day.completed}/{day.goal}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subject Progress */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Progresso por Matéria
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {subjects.map((subject, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-foreground">{subject.name}</h3>
                    <Badge variant="outline">
                      {subject.completed}/{subject.total}
                    </Badge>
                  </div>
                  <Progress value={subject.progress} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{subject.progress}% concluído</span>
                    <span>{subject.timeSpent} estudadas</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Conquistas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border ${
                    achievement.unlocked 
                      ? 'bg-success/5 border-success/20' 
                      : 'bg-muted/30 border-border'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Trophy 
                      className={`w-5 h-5 flex-shrink-0 ${
                        achievement.unlocked ? 'text-success' : 'text-muted-foreground'
                      }`} 
                    />
                    <div>
                      <h4 className={`font-medium ${
                        achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      {achievement.unlocked && (
                        <Badge variant="secondary" className="mt-2 bg-success/10 text-success">
                          Desbloqueado
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Learning Streak */}
          <Card className="shadow-card bg-accent-gradient text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Sequência de Estudos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">7</div>
                <p className="text-white/90 mb-4">dias consecutivos</p>
                <div className="text-sm text-white/80">
                  Continue estudando para manter sua sequência!
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}