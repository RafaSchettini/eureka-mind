import { useState, useEffect } from 'react';
import { TriviaQuestion, QuizAnswer, QuizAttempt } from '@/lib/external-apis.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Trophy, Target, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizPlayerProps {
  questions: TriviaQuestion[];
  onQuizComplete: (attempt: QuizAttempt) => void;
  onQuizExit: () => void;
}

export function QuizPlayer({ questions, onQuizComplete, onQuizExit }: QuizPlayerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Embaralha as respostas quando muda a questão
  useEffect(() => {
    if (currentQuestion) {
      const allAnswers = [currentQuestion.correct_answer, ...currentQuestion.incorrect_answers];
      setShuffledAnswers(allAnswers.sort(() => Math.random() - 0.5));
      setSelectedAnswer('');
      setShowResult(false);
      setIsAnswered(false);
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestion]);

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    setShowResult(true);

    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
    const isCorrect = answer === currentQuestion.correct_answer;

    const newAnswer: QuizAnswer = {
      question_index: currentQuestionIndex,
      selected_answer: answer,
      correct_answer: currentQuestion.correct_answer,
      is_correct: isCorrect,
      time_spent: timeSpent
    };

    setAnswers(prev => [...prev, newAnswer]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz finalizado
      const quizAttempt: QuizAttempt = {
        id: crypto.randomUUID(),
        user_id: '', // Será preenchido pelo componente pai
        questions,
        answers,
        score: calculateTotalScore(),
        total_questions: questions.length,
        completed_at: new Date().toISOString(),
        category: questions[0]?.category || 'Mixed',
        difficulty: questions[0]?.difficulty || 'easy'
      };
      
      onQuizComplete(quizAttempt);
    }
  };

  const calculateTotalScore = () => {
    return answers.reduce((total, answer, index) => {
      if (answer.is_correct) {
        const difficulty = questions[index]?.difficulty || 'easy';
        switch (difficulty) {
          case 'easy': return total + 10;
          case 'medium': return total + 20;
          case 'hard': return total + 30;
          default: return total + 10;
        }
      }
      return total;
    }, 0);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header do Quiz */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className={getDifficultyColor(currentQuestion.difficulty)}>
              {currentQuestion.difficulty}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {currentQuestion.category}
            </span>
          </div>
          <Button variant="outline" onClick={onQuizExit}>
            Sair do Quiz
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Questão {currentQuestionIndex + 1} de {questions.length}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Pontuação: {calculateTotalScore()}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Questão */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg leading-relaxed">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {shuffledAnswers.map((answer, index) => {
              const isSelected = selectedAnswer === answer;
              const isCorrect = answer === currentQuestion.correct_answer;
              const isWrong = isSelected && !isCorrect;

              return (
                <Button
                  key={index}
                  variant="outline"
                  className={cn(
                    "p-4 h-auto text-left justify-start text-wrap",
                    isSelected && !showResult && "border-primary bg-primary/5",
                    showResult && isCorrect && "border-green-500 bg-green-50 text-green-700",
                    showResult && isWrong && "border-red-500 bg-red-50 text-red-700"
                  )}
                  onClick={() => handleAnswerSelect(answer)}
                  disabled={isAnswered}
                >
                  <div className="flex items-center gap-3 w-full">
                    <span className="flex-1">{answer}</span>
                    {showResult && isCorrect && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {showResult && isWrong && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                </Button>
              );
            })}
          </div>

          {/* Feedback da resposta */}
          {showResult && (
            <div className="mt-4 p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-2 mb-2">
                {selectedAnswer === currentQuestion.correct_answer ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-700">Correto!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-700">Incorreto</span>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                A resposta correta é: <strong>{currentQuestion.correct_answer}</strong>
              </p>
            </div>
          )}

          {/* Botão próxima questão */}
          {showResult && (
            <div className="mt-6 flex justify-end">
              <Button onClick={handleNextQuestion}>
                {currentQuestionIndex < questions.length - 1 ? 'Próxima Questão' : 'Finalizar Quiz'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Componente para exibir resultados do quiz
interface QuizResultsProps {
  attempt: QuizAttempt;
  onRestart: () => void;
  onExit: () => void;
}

export function QuizResults({ attempt, onRestart, onExit }: QuizResultsProps) {
  const correctAnswers = attempt.answers.filter(answer => answer.is_correct).length;
  const accuracy = Math.round((correctAnswers / attempt.total_questions) * 100);
  const averageTime = Math.round(
    attempt.answers.reduce((sum, answer) => sum + answer.time_spent, 0) / attempt.answers.length
  );

  const getPerformanceMessage = () => {
    if (accuracy >= 80) return "Excelente trabalho! 🎉";
    if (accuracy >= 60) return "Bom desempenho! 👍";
    if (accuracy >= 40) return "Continue praticando! 💪";
    return "Não desista, tente novamente! 🚀";
  };

  const getPerformanceColor = () => {
    if (accuracy >= 80) return "text-green-600";
    if (accuracy >= 60) return "text-blue-600";
    if (accuracy >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary-gradient rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Quiz Finalizado!</CardTitle>
          <CardDescription className={getPerformanceColor()}>
            {getPerformanceMessage()}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Estatísticas principais */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{correctAnswers}/{attempt.total_questions}</div>
              <div className="text-sm text-muted-foreground">Acertos</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{accuracy}%</div>
              <div className="text-sm text-muted-foreground">Precisão</div>
            </div>
          </div>

          {/* Detalhes adicionais */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pontuação Total:</span>
              <Badge variant="secondary">{attempt.score} pontos</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tempo Médio por Questão:</span>
              <Badge variant="outline">{averageTime}s</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Categoria:</span>
              <Badge variant="outline">{attempt.category}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Dificuldade:</span>
              <Badge variant="outline">{attempt.difficulty}</Badge>
            </div>
          </div>

          {/* Progresso visual */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progresso</span>
              <span>{accuracy}%</span>
            </div>
            <Progress value={accuracy} className="h-3" />
          </div>

          {/* Botões de ação */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onExit} className="flex-1">
              Voltar ao Menu
            </Button>
            <Button onClick={onRestart} className="flex-1">
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}