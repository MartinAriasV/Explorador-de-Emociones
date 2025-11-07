
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Emotion, GameProps, QuizQuestion } from '@/lib/types';
import { QUIZ_QUESTIONS, PREDEFINED_EMOTIONS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const difficulties: QuizQuestion['difficulty'][] = ['Fácil', 'Medio', 'Difícil', 'Experto'];

export function GuessEmotionGame({ emotionsList }: GameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [options, setOptions] = useState<Emotion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<Emotion | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [difficultyIndex, setDifficultyIndex] = useState(0);

  // All emotions available to the user, including custom ones. Used for generating incorrect options.
  const allUserEmotions = useMemo(() => {
    const emotionMap = new Map<string, Emotion>();
    PREDEFINED_EMOTIONS.forEach(p => emotionMap.set(p.name.toLowerCase(), { ...p, id: p.name, userProfileId: 'system', isCustom: false } as Emotion));
    emotionsList.forEach(e => emotionMap.set(e.name.toLowerCase(), e));
    return Array.from(emotionMap.values());
  }, [emotionsList]);
  
  // All predefined emotions, used to guarantee questions can always be generated.
  const allPredefinedEmotions = useMemo(() => {
      return PREDEFINED_EMOTIONS.map(p => ({ ...p, id: p.name, userProfileId: 'system', isCustom: false } as Emotion));
  }, []);


  const generateQuestion = useCallback(() => {
    const currentDifficulty = difficulties[difficultyIndex];
    
    // 1. Find all quiz questions that match the current difficulty.
    let possibleQuestions = QUIZ_QUESTIONS.filter(q => 
        q.difficulty === currentDifficulty
    );

    // 2. Fallback: If no questions found for the current difficulty, try with 'Fácil'.
    if (possibleQuestions.length === 0) {
        possibleQuestions = QUIZ_QUESTIONS.filter(q => 
            q.difficulty === 'Fácil'
        );
    }

    // 3. If there are still no possible questions, something is wrong with the constants.
    if (possibleQuestions.length === 0) {
        console.error("No quiz questions found, even for 'Fácil' difficulty. Check QUIZ_QUESTIONS constant.");
        setCurrentQuestion(null);
        return;
    }

    // 4. Select a random question from the valid list.
    const randomQuestion = shuffleArray(possibleQuestions)[0];
    
    // 5. Find the correct emotion from the *complete predefined list*. This ensures it's always found.
    const correctEmotion = allPredefinedEmotions.find(e => e.name.toLowerCase() === randomQuestion.correctAnswer.toLowerCase());

    if (!correctEmotion) {
        console.error(`Could not find correct emotion "${randomQuestion.correctAnswer}" in predefined list.`);
        // Try to generate another question to avoid getting stuck
        if (questionsAnswered < 15) { // safety break
            setQuestionsAnswered(p => p+1);
            generateQuestion();
        }
        return;
    }

    // 6. Generate options for the answer using the user's full list of emotions.
    const incorrectOptions = shuffleArray(allUserEmotions.filter(e => e.id !== correctEmotion.id)).slice(0, 3);
    const allOptions = shuffleArray([correctEmotion, ...incorrectOptions]);

    setCurrentQuestion(randomQuestion);
    setOptions(allOptions);
    setIsAnswered(false);
    setSelectedAnswer(null);

  }, [difficultyIndex, allUserEmotions, allPredefinedEmotions, questionsAnswered]);


  useEffect(() => {
    if (allUserEmotions.length >= 4) {
      generateQuestion();
    }
  }, [allUserEmotions.length, generateQuestion]);

  const handleAnswer = (answer: Emotion) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);
    setQuestionsAnswered(prev => prev + 1);

    if (answer.name.toLowerCase() === currentQuestion?.correctAnswer.toLowerCase()) {
      setScore(prev => prev + 1);
      // Increase difficulty, but not past 'Experto'
      setDifficultyIndex(prev => Math.min(prev + 1, difficulties.length - 1));
    } else {
      // Decrease difficulty, but not below 'Fácil'
      setDifficultyIndex(prev => Math.max(prev - 1, 0));
    }
  };

  const handleNext = () => {
    if (questionsAnswered >= 10) {
      setScore(0);
      setQuestionsAnswered(0);
      setDifficultyIndex(0); // Reset difficulty
    }
    generateQuestion();
  };
  
  if (allUserEmotions.length < 4) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-lg bg-muted/50">
              <p className="text-lg font-semibold">¡Faltan Emociones!</p>
              <p>Necesitas al menos 4 emociones diferentes para jugar a este juego.</p>
              <p className="text-sm mt-2">Ve a "Descubrir" o "Emocionario" para añadir más.</p>
          </div>
      )
  }

  if (!currentQuestion) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-lg bg-muted/50">
              <p className="text-lg font-semibold">Cargando...</p>
          </div>
      )
  }

  if (questionsAnswered >= 10) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h2 className="text-2xl font-bold text-primary">¡Juego Terminado!</h2>
            <p className="text-5xl font-bold my-4">{score} / 10</p>
            <p className="text-muted-foreground mb-6">¡Sigue practicando para mejorar tu inteligencia emocional!</p>
            <Button onClick={handleNext}>Jugar de Nuevo</Button>
        </div>
    )
  }

  const correctEmotionDetails = allPredefinedEmotions.find(e => e.name.toLowerCase() === currentQuestion.correctAnswer.toLowerCase());

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="text-center w-full max-w-2xl">
        <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-primary">Puntuación: {score} / {questionsAnswered}</p>
            <p className="text-sm font-semibold text-accent">Dificultad: {currentQuestion.difficulty}</p>
        </div>
        <p className="text-lg mt-4">¿Qué emoción describe mejor esta situación?</p>
      </div>

      <Card className="w-full max-w-2xl p-6 text-center shadow-inner bg-muted/30">
        <CardContent className="p-0">
          <blockquote className="text-xl italic font-semibold">
            "{currentQuestion?.question}"
          </blockquote>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
        {options.map((option) => {
            const isSelected = selectedAnswer?.id === option.id;
            const isCorrect = correctEmotionDetails?.id === option.id;

            return (
                 <Button
                    key={option.id}
                    onClick={() => handleAnswer(option)}
                    disabled={isAnswered}
                    className={cn(
                        "h-auto py-4 text-base whitespace-normal",
                        isAnswered && isCorrect && 'bg-green-500 hover:bg-green-600 border-green-500 text-white',
                        isAnswered && isSelected && !isCorrect && 'bg-destructive hover:bg-destructive/90 border-destructive text-destructive-foreground',
                        isAnswered && !isSelected && !isCorrect && 'opacity-50'
                    )}
                 >
                    {isAnswered && isSelected && !isCorrect && <XCircle className="mr-2 h-5 w-5" />}
                    {isAnswered && isCorrect && <CheckCircle className="mr-2 h-5 w-5" />}
                    {option.icon} {option.name}
                 </Button>
            );
        })}
      </div>

      {isAnswered && (
        <div className="flex flex-col items-center gap-4 animate-fade-in">
             <p className={cn(
                "text-lg font-bold",
                selectedAnswer?.name.toLowerCase() === currentQuestion.correctAnswer.toLowerCase() ? 'text-green-600' : 'text-destructive'
             )}>
                {selectedAnswer?.name.toLowerCase() === currentQuestion.correctAnswer.toLowerCase() ? '¡Correcto!' : `Incorrecto. La respuesta era: ${currentQuestion.correctAnswer}`}
            </p>
            <Button onClick={handleNext}>
                {questionsAnswered >= 10 ? 'Ver Resultados' : 'Siguiente Pregunta'}
            </Button>
        </div>
      )}
    </div>
  );
}
