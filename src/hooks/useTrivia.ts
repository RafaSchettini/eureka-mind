import { useState, useEffect } from 'react';
import { triviaService } from '@/services/triviaService';
import { TriviaQuestion, TriviaCategory, QuizAttempt, QuizAnswer } from '@/lib/external-apis.types';

export function useTrivia() {
  const [categories, setCategories] = useState<TriviaCategory[]>([]);
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<TriviaQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await triviaService.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (params: {
    amount?: number;
    category?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    type?: 'multiple' | 'boolean';
  } = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await triviaService.getQuestions(params);
      setQuestions(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar questões');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async (params: {
    amount?: number;
    category?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    type?: 'multiple' | 'boolean';
  } = {}) => {
    const quizQuestions = await fetchQuestions(params);
    setCurrentQuiz(quizQuestions);
    return quizQuestions;
  };

  const shuffleAnswers = (question: TriviaQuestion): string[] => {
    return triviaService.shuffleAnswers(question);
  };

  const checkAnswer = (question: TriviaQuestion, selectedAnswer: string): boolean => {
    return triviaService.checkAnswer(question, selectedAnswer);
  };

  const calculateScore = (difficulty: string): number => {
    return triviaService.calculateScore(difficulty);
  };

  const finishQuiz = (answers: QuizAnswer[]): QuizAttempt => {
    const totalQuestions = currentQuiz.length;
    const correctAnswers = answers.filter(answer => answer.is_correct).length;
    const totalScore = answers.reduce((sum, answer, index) => {
      if (answer.is_correct) {
        return sum + calculateScore(currentQuiz[index]?.difficulty || 'easy');
      }
      return sum;
    }, 0);

    const quizAttempt: QuizAttempt = {
      id: crypto.randomUUID(),
      user_id: '', // Será preenchido pelo componente que usar o hook
      questions: currentQuiz,
      answers,
      score: totalScore,
      total_questions: totalQuestions,
      completed_at: new Date().toISOString(),
      category: currentQuiz[0]?.category || 'Mixed',
      difficulty: currentQuiz[0]?.difficulty || 'easy'
    };

    return quizAttempt;
  };

  const getQuizStatistics = (attempt: QuizAttempt) => {
    const correctAnswers = attempt.answers.filter(answer => answer.is_correct).length;
    const accuracy = (correctAnswers / attempt.total_questions) * 100;
    const averageTime = attempt.answers.reduce((sum, answer) => sum + answer.time_spent, 0) / attempt.answers.length;
    
    return {
      correctAnswers,
      wrongAnswers: attempt.total_questions - correctAnswers,
      accuracy: Math.round(accuracy),
      averageTime: Math.round(averageTime),
      totalScore: attempt.score,
      category: attempt.category,
      difficulty: attempt.difficulty
    };
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    questions,
    currentQuiz,
    loading,
    error,
    fetchCategories,
    fetchQuestions,
    startQuiz,
    shuffleAnswers,
    checkAnswer,
    calculateScore,
    finishQuiz,
    getQuizStatistics,
    clearError: () => setError(null),
    clearQuiz: () => {
      setCurrentQuiz([]);
      setQuestions([]);
    }
  };
}