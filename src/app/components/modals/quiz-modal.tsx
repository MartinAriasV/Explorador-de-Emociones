"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { QUIZ_QUESTIONS } from '@/lib/constants';
import type { QuizQuestion } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface QuizModalProps {
  onClose: () => void;
  onComplete: (success: boolean) => void;
}

const QUESTIONS_PER_QUIZ = 5;
const REQUIRED_SCORE = 3;

// Function to get a random item from an array
const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export function QuizModal({ onClose, onComplete }: QuizModalProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    // Generate a unique set of questions for the quiz
    const difficulties: QuizQuestion['difficulty'][] = ['Fácil', 'Medio', 'Difícil', 'Experto'];
    const selectedQuestions: QuizQuestion[] = [];
    const usedIndexes = new Set<number>();

    // Add one extra question to reach 5 total
    const allDifficulties = [...difficulties, 'Medio']; 

    allDifficulties.forEach(difficulty => {
      const questionsOfDifficulty = QUIZ_QUESTIONS.map((q, i) => ({ ...q, originalIndex: i })).filter(q => q.difficulty === difficulty);
      let question;
      do {
        question = getRandomItem(questionsOfDifficulty);
      } while (question && usedIndexes.has(question.originalIndex));
      
      if(question) {
        selectedQuestions.push(question);
        usedIndexes.add(question.originalIndex);
      }
    });

    setQuestions(selectedQuestions);
  }, []);

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
    } else {
      // Quiz finished
      onComplete(score >= REQUIRED_SCORE);
    }
  };
  
  if (questions.length === 0) {
    return <div className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center">Cargando desafío...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  
  return (
    <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl text-primary">Desafío de Recuperación</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <CardDescription>Responde {REQUIRED_SCORE} de {QUESTIONS_PER_QUIZ} preguntas correctamente para recuperar el día.</CardDescription>
          <div className="flex items-center gap-4 pt-2">
             <Progress value={progress} className="w-full" />
             <span className="text-sm font-semibold text-muted-foreground">{currentQuestionIndex + 1} / {questions.length}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-lg font-semibold">{currentQuestion.question}</p>
            <p className="text-sm text-muted-foreground font-semibold" style={{ color: `hsl(var(--accent))` }}>Dificultad: {currentQuestion.difficulty}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentQuestion.options.map(option => {
                const isSelected = selectedAnswer === option;
                const isTheCorrectAnswer = currentQuestion.correctAnswer === option;

                return (
                    <Button
                        key={option}
                        variant={isAnswered && (isSelected || isTheCorrectAnswer) ? 'default' : 'outline'}
                        className={cn(
                            "h-auto py-3 whitespace-normal justify-start text-left",
                            isAnswered && isTheCorrectAnswer && 'bg-green-500 hover:bg-green-600 border-green-500 text-white',
                            isAnswered && isSelected && !isTheCorrectAnswer && 'bg-destructive hover:bg-destructive/90 border-destructive text-destructive-foreground',
                            isAnswered && !isSelected && !isTheCorrectAnswer && 'opacity-50'
                        )}
                        onClick={() => handleAnswer(option)}
                        disabled={isAnswered}
                    >
                         {isAnswered && isSelected && !isTheCorrectAnswer && <XCircle className="mr-2 h-5 w-5" />}
                         {isAnswered && isTheCorrectAnswer && <CheckCircle className="mr-2 h-5 w-5" />}
                        {option}
                    </Button>
                )
            })}
          </div>
        </CardContent>
        <CardFooter>
            {isAnswered && (
                <div className="w-full flex flex-col sm:flex-row items-center gap-4 animate-fade-in">
                    <p className={cn("text-lg font-bold", isCorrect ? 'text-green-600' : 'text-destructive')}>
                        {isCorrect ? '¡Correcto!' : 'Incorrecto.'}
                    </p>
                    <Button onClick={handleNext} className="w-full sm:w-auto ml-auto">
                        {currentQuestionIndex === questions.length - 1 ? 'Finalizar Desafío' : 'Siguiente Pregunta'}
                    </Button>
                </div>
            )}
        </CardFooter>
      </Card>
    </div>
  );
}
