
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Emotion, GameProps } from '@/lib/types';
import { EMOTION_ANTONYMS, PREDEFINED_EMOTIONS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export function AntonymGame({ emotionsList }: GameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<{ emotion: Emotion; antonym: Emotion; } | null>(null);
  const [options, setOptions] = useState<Emotion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<Emotion | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const allEmotions = useMemo(() => {
    const emotionMap = new Map<string, Emotion>();
    // First, add all predefined emotions as non-custom
    PREDEFINED_EMOTIONS.forEach(p => emotionMap.set(p.name.toLowerCase(), { ...p, id: p.name, userProfileId: 'system', isCustom: false } as Emotion));
    // Then, overwrite with user's emotions, which might include customized versions of predefined ones
    emotionsList.forEach(e => emotionMap.set(e.name.toLowerCase(), e));
    return Array.from(emotionMap.values());
  }, [emotionsList]);
  
  const generateQuestion = useCallback(() => {
    const verifiedEmotions = allEmotions.filter(e => !e.isCustom);
    if (verifiedEmotions.length < 4) return;

    const availablePairs = shuffleArray(EMOTION_ANTONYMS);
    let questionEmotion: Emotion | undefined;
    let antonymEmotion: Emotion | undefined;

    for (const pair of availablePairs) {
        questionEmotion = verifiedEmotions.find(e => e.name.toLowerCase() === pair[0].toLowerCase());
        antonymEmotion = verifiedEmotions.find(e => e.name.toLowerCase() === pair[1].toLowerCase());
        if (questionEmotion && antonymEmotion) {
            break;
        }
    }
    
    if (!questionEmotion || !antonymEmotion) return;

    // Incorrect options can be from all emotions (custom or not)
    const otherEmotions = allEmotions.filter(e => e.id !== questionEmotion!.id && e.id !== antonymEmotion!.id);
    const incorrectOptions = shuffleArray(otherEmotions).slice(0, 3);
    
    const allOptions = shuffleArray([antonymEmotion, ...incorrectOptions]);

    setCurrentQuestion({ emotion: questionEmotion, antonym: antonymEmotion });
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

    if (answer.id === currentQuestion?.antonym.id) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (questionsAnswered >= 10) {
      setScore(0);
      setQuestionsAnswered(0);
    }
    generateQuestion();
  };
  
  if (allEmotions.filter(e => !e.isCustom).length < 4) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-lg bg-muted/50">
              <p className="text-lg font-semibold">¡Faltan Emociones Verificadas!</p>
              <p>Necesitas al menos 4 emociones no personalizadas con antónimos definidos para jugar.</p>
              <p className="text-sm mt-2">Asegúrate de tener emociones como 'Alegría', 'Tristeza', 'Miedo', 'Confianza' desde la sección "Descubrir".</p>
          </div>
      );
  }

  if (questionsAnswered >= 10) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h2 className="text-2xl font-bold text-primary">¡Juego Terminado!</h2>
            <p className="text-5xl font-bold my-4">{score} / 10</p>
            <p className="text-muted-foreground mb-6">¡Entender los opuestos es clave para el equilibrio emocional!</p>
            <Button onClick={handleNext}>Jugar de Nuevo</Button>
        </div>
    );
  }

  if (!currentQuestion) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-lg bg-muted/50">
              <p className="text-lg font-semibold">Cargando...</p>
          </div>
      )
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="text-center">
        <p className="text-sm font-semibold text-primary">Puntuación: {score} / {questionsAnswered}</p>
        <p className="text-lg mt-2">¿Cuál es el antónimo (opuesto) de esta emoción?</p>
      </div>

      <Card className="w-full max-w-2xl p-6 text-center shadow-inner bg-muted/30">
        <CardContent className="p-0">
          <div className="text-3xl font-bold flex items-center justify-center gap-3">
            <span>{currentQuestion.emotion.icon}</span>
            <span>{currentQuestion.emotion.name}</span>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
        {options.map((option) => {
            const isSelected = selectedAnswer?.id === option.id;
            const isCorrect = currentQuestion?.antonym.id === option.id;

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
                selectedAnswer?.id === currentQuestion?.antonym.id ? 'text-green-600' : 'text-destructive'
             )}>
                {selectedAnswer?.id === currentQuestion?.antonym.id ? '¡Correcto!' : `Incorrecto. El opuesto era: ${currentQuestion?.antonym.name}`}
            </p>
            <Button onClick={handleNext}>
                {questionsAnswered >= 10 ? 'Ver Resultados' : 'Siguiente Pregunta'}
            </Button>
        </div>
      )}
    </div>
  );
}
