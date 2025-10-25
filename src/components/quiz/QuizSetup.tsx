import { useState } from 'react';
import { TriviaCategory, TriviaQuestion } from '@/lib/external-apis.types';
import { useTrivia } from '@/hooks/useTrivia';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Play, Target, Clock, Star } from 'lucide-react';

interface QuizSetupProps {
  onStartQuiz: (questions: TriviaQuestion[]) => void;
}

export function QuizSetup({ onStartQuiz }: QuizSetupProps) {
  const { categories, loading, startQuiz } = useTrivia();
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [selectedAmount, setSelectedAmount] = useState<number>(5);
  const [isStarting, setIsStarting] = useState(false);

  const handleStartQuiz = async () => {
    setIsStarting(true);
    try {
      const questions = await startQuiz({
        amount: selectedAmount,
        category: selectedCategory,
        difficulty: selectedDifficulty,
        type: 'multiple'
      });
      
      if (questions.length > 0) {
        onStartQuiz(questions);
      }
    } catch (error) {
      console.error('Erro ao iniciar quiz:', error);
    } finally {
      setIsStarting(false);
    }
  };

  const getDifficultyDescription = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Questões básicas - 10 pontos cada';
      case 'medium': return 'Questões intermediárias - 20 pontos cada';
      case 'hard': return 'Questões avançadas - 30 pontos cada';
      default: return '';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const estimatedTime = selectedAmount * 1.5; // 1.5 minutos por questão

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary-gradient rounded-full flex items-center justify-center">
            <Target className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Configurar Quiz</CardTitle>
          <CardDescription>
            Personalize seu quiz de conhecimentos e teste suas habilidades
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Seleção de Categoria */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria</label>
            <Select value={selectedCategory?.toString()} onValueChange={(value) => setSelectedCategory(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mixed">Conhecimentos Gerais</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Seleção de Dificuldade */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Dificuldade</label>
            <div className="grid grid-cols-3 gap-3">
              {['easy', 'medium', 'hard'].map((difficulty) => (
                <Button
                  key={difficulty}
                  variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                  className="h-auto p-4 flex flex-col gap-2"
                  onClick={() => setSelectedDifficulty(difficulty as 'easy' | 'medium' | 'hard')}
                >
                  <Badge 
                    variant="outline" 
                    className={`${getDifficultyColor(difficulty)} whitespace-nowrap`}
                  >
                    {difficulty === 'easy' ? 'Fácil' : difficulty === 'medium' ? 'Médio' : 'Difícil'}
                  </Badge>
                  <span className="text-xs text-muted-foreground text-center break-words">
                    {getDifficultyDescription(difficulty)}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Quantidade de Questões */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quantidade de Questões</label>
            <Select value={selectedAmount.toString()} onValueChange={(value) => setSelectedAmount(Number(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 questões</SelectItem>
                <SelectItem value="10">10 questões</SelectItem>
                <SelectItem value="15">15 questões</SelectItem>
                <SelectItem value="20">20 questões</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Informações do Quiz */}
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm">Resumo do Quiz</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span>{selectedAmount} questões</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>~{Math.ceil(estimatedTime)} min</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-muted-foreground" />
                <span>Dificuldade: {selectedDifficulty === 'easy' ? 'Fácil' : selectedDifficulty === 'medium' ? 'Médio' : 'Difícil'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span>Múltipla escolha</span>
              </div>
            </div>
          </div>

          {/* Botão para iniciar */}
          <Button 
            onClick={handleStartQuiz} 
            disabled={loading || isStarting}
            className="w-full h-12"
            size="lg"
          >
            {isStarting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Preparando Quiz...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Iniciar Quiz
              </>
            )}
          </Button>

          {loading && (
            <div className="text-center text-sm text-muted-foreground">
              Carregando categorias...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}