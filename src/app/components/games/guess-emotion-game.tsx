
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { Emotion } from '@/lib/types';
import { PREDEFINED_EMOTIONS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Lightbulb, CheckCircle, XCircle } from 'lucide-react';

interface GuessEmotionGameProps {
  emotionsList: Emotion[];
}

// Function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  return array.sort(() => Math.random() - 0.5);
};

export function GuessEmotionGame({ emotionsList }: GuessEmotionGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [options, setOptions] = useState<Emotion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<Emotion | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const availableEmotions = useMemo(() => {
    // Use user's emotions if they have enough, otherwise use predefined
    return emotionsList.length >= 4 ? emotionsList : PREDEFINED_EMOTIONS;
  }, [emotionsList]);
  
  const generateQuestion = () => {
    if (availableEmotions.length < 4) {
      return; // Not enough emotions to generate a question
    }

    // 1. Select a random correct emotion
    const correctEmotion = shuffleArray(availableEmotions)[0];

    // 2. Get its description/example
    const predefined = PREDEFINED_EMOTIONS.find(p => p.name === correctEmotion.name);
    const questionText = predefined ? predefined.example || predefined.description : correctEmotion.description;

    // 3. Select 3 other random incorrect emotions
    const otherEmotions = availableEmotions.filter(e => e.name !== correctEmotion.name);
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
  };

  useEffect(() => {
    generateQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableEmotions]);

  const handleAnswer = (answer: Emotion) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);
    setQuestionsAnswered(prev => prev + 1);

    if (answer.name === currentQuestion.correctAnswer.name) {
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
  
  if (availableEmotions.length < 4) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-lg bg-muted/50">
              <p className="text-lg font-semibold">¡Faltan Emociones!</p>
              <p>Necesitas al menos 4 emociones en tu emocionario para jugar a este juego.</p>
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
            const isSelected = selectedAnswer?.name === option.name;
            const isCorrect = currentQuestion?.correctAnswer.name === option.name;

            return (
                 <Button
                    key={option.name}
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
                selectedAnswer?.name === currentQuestion?.correctAnswer.name ? 'text-green-600' : 'text-destructive'
             )}>
                {selectedAnswer?.name === currentQuestion?.correctAnswer.name ? '¡Correcto!' : `Incorrecto. La respuesta era: ${currentQuestion?.correctAnswer.name}`}
            </p>
            <Button onClick={handleNext}>
                {questionsAnswered >= 10 ? 'Ver Resultados' : 'Siguiente Pregunta'}
            </Button>
        </div>
      )}
    </div>
  );
}
