
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Emotion } from '@/lib/types';
import { PREDEFINED_EMOTIONS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';

interface GuessEmotionGameProps {
  emotionsList: Emotion[];
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export function GuessEmotionGame({ emotionsList }: GuessEmotionGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [options, setOptions] = useState<Emotion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<Emotion | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const allEmotions = useMemo(() => {
    // Combine predefined emotions with user's custom emotions, ensuring no duplicates by name
    const emotionMap = new Map<string, Emotion>();
    PREDEFINED_EMOTIONS.forEach(p => emotionMap.set(p.name.toLowerCase(), { ...p, id: p.name, userProfileId: 'system' } as Emotion));
    emotionsList.forEach(e => emotionMap.set(e.name.toLowerCase(), e));
    return Array.from(emotionMap.values());
  }, [emotionsList]);
  
  const generateQuestion = useCallback(() => {
    if (allEmotions.length < 4) {
      return; // Not enough emotions to play
    }

    // 1. Select a random correct emotion *only* from the predefined list for quality questions
    const correctEmotionPredefined = shuffleArray(PREDEFINED_EMOTIONS)[0];
    // Find the full emotion object in case the user has customized it
    const correctEmotion = allEmotions.find(e => e.name.toLowerCase() === correctEmotionPredefined.name.toLowerCase())!;

    // 2. Get its description or example as the question
    const questionText = correctEmotionPredefined.example || correctEmotionPredefined.description;

    // 3. Select 3 other random incorrect emotions from the full list
    const otherEmotions = allEmotions.filter(e => e.id !== correctEmotion.id);
    const incorrectOptions = shuffleArray(otherEmotions).slice(0, 3);
    
    // 4. Combine and shuffle options
    const allOptions = shuffleArray([correctEmotion, ...incorrectOptions]);

    setCurrentQuestion({
      text: questionText,
      correctAnswer: correctEmotion,
    });
    setOptions(allOptions);
    setIsAnswered(false);
    setSelectedAnswer(null);
  }, [allEmotions]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleAnswer = (answer: Emotion) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);
    setQuestionsAnswered(prev => prev + 1);

    if (answer.id === currentQuestion.correctAnswer.id) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (questionsAnswered >= 10) {
      // Reset game
      setScore(0);
      setQuestionsAnswered(0);
    }
    generateQuestion();
  };
  
  if (allEmotions.length < 4) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-lg bg-muted/50">
              <p className="text-lg font-semibold">¡Faltan Emociones!</p>
              <p>Necesitas al menos 4 emociones en total para jugar a este juego.</p>
              <p className="text-sm mt-2">Ve a "Descubrir" o "Emocionario" para añadir más.</p>
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

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="text-center">
        <p className="text-sm font-semibold text-primary">Puntuación: {score} / {questionsAnswered}</p>
        <p className="text-lg mt-2">¿Qué emoción describe mejor esta situación?</p>
      </div>

      <Card className="w-full max-w-2xl p-6 text-center shadow-inner bg-muted/30">
        <CardContent className="p-0">
          <blockquote className="text-xl italic font-semibold">
            "{currentQuestion?.text}"
          </blockquote>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
        {options.map((option) => {
            const isSelected = selectedAnswer?.id === option.id;
            const isCorrect = currentQuestion?.correctAnswer.id === option.id;

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
                selectedAnswer?.id === currentQuestion?.correctAnswer.id ? 'text-green-600' : 'text-destructive'
             )}>
                {selectedAnswer?.id === currentQuestion?.correctAnswer.id ? '¡Correcto!' : `Incorrecto. La respuesta era: ${currentQuestion?.correctAnswer.name}`}
            </p>
            <Button onClick={handleNext}>
                {questionsAnswered >= 10 ? 'Ver Resultados' : 'Siguiente Pregunta'}
            </Button>
        </div>
      )}
    </div>
  );
}
