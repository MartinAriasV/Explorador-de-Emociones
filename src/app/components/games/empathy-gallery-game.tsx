
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Emotion, GameProps } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Zap, Image as ImageIcon } from 'lucide-react';
import imageData from '@/lib/placeholder-images.json';
import Image from 'next/image';
import type { User } from 'firebase/auth';

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const QUESTIONS_PER_GAME = 10;

interface EmpathyGalleryGameProps extends GameProps {
    addPoints: (amount: number) => void;
    user: User;
}

interface EmpathyQuestion {
    imageUrl: string;
    correctEmotion: string;
    options: Emotion[];
    hint: string;
}

export function EmpathyGalleryGame({ emotionsList, addPoints }: EmpathyGalleryGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<EmpathyQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<Emotion | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [questionHistory, setQuestionHistory] = useState<string[]>([]);
  const [isLoadingImage, setIsLoadingImage] = useState(true);

  const empathyImages = useMemo(() => imageData.empathy_gallery, []);
  
  const generateQuestion = useCallback(() => {
    setIsLoadingImage(true);
    const availableImages = empathyImages.filter(img => 
      !questionHistory.includes(img.id) &&
      emotionsList.some(e => e.name.toLowerCase() === img.emotion.toLowerCase())
    );

    if (availableImages.length === 0) {
      setIsPlaying(false);
      return;
    }

    const questionImage = shuffleArray(availableImages)[0];
    const correctEmotion = emotionsList.find(e => e.name.toLowerCase() === questionImage.emotion.toLowerCase());

    // This should ideally not happen if availableImages is filtered correctly, but it's a good safeguard.
    if (!correctEmotion) {
        // If we can't find a matching emotion for some reason, we just end the game to avoid a loop.
        setIsPlaying(false);
        console.error("Could not find a matching emotion for the selected image. Ending game.");
        return;
    }

    const incorrectOptions = shuffleArray(emotionsList.filter(e => e.id !== correctEmotion.id)).slice(0, 3);
    const allOptions = shuffleArray([correctEmotion, ...incorrectOptions]);
    
    setCurrentQuestion({
        imageUrl: `https://picsum.photos/seed/${questionImage.seed}/${questionImage.width}/${questionImage.height}`,
        correctEmotion: correctEmotion.name,
        options: allOptions,
        hint: questionImage.hint
    });
    
    setQuestionHistory(prev => [...prev, questionImage.id]);
    setIsAnswered(false);
    setSelectedAnswer(null);
  }, [emotionsList, empathyImages, questionHistory]);

  useEffect(() => {
    if (isPlaying && questionsAnswered < QUESTIONS_PER_GAME) {
      generateQuestion();
    } else if (questionsAnswered >= QUESTIONS_PER_GAME) {
      setIsPlaying(false);
    }
  }, [isPlaying, questionsAnswered, generateQuestion]);

  const handleAnswer = (answer: Emotion) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer.name.toLowerCase() === currentQuestion?.correctEmotion.toLowerCase()) {
      setScore(prev => prev + 1);
      addPoints(5);
    }
  };

  const handleNext = () => {
    setQuestionsAnswered(prev => prev + 1);
  };

  const startGame = () => {
    setScore(0);
    setQuestionsAnswered(0);
    setQuestionHistory([]);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setIsPlaying(true);
  };

  if (emotionsList.length < 4) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4 md:p-8 rounded-lg bg-muted/50">
            <p className="text-lg font-semibold">¡Faltan Emociones!</p>
            <p className="max-w-md">Necesitas al menos 4 emociones diferentes en tu Emocionario para jugar.</p>
        </div>
    );
  }

  if (!isPlaying) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4 md:p-8">
            <h2 className="text-2xl font-bold text-primary">Galería de Empatía</h2>
            <p className="text-muted-foreground my-4 max-w-md">Observa la imagen y adivina qué emoción está sintiendo la persona. ¡Gana 5 puntos por cada acierto!</p>
            {questionsAnswered >= QUESTIONS_PER_GAME && (
                <>
                    <p className="text-lg my-2">¡Partida terminada!</p>
                    <p className="text-5xl font-bold mb-6">{score} / {QUESTIONS_PER_GAME}</p>
                </>
            )}
            <Button onClick={startGame} size="lg">
                <Zap className="mr-2" />
                {questionsAnswered >= QUESTIONS_PER_GAME ? 'Jugar de Nuevo' : 'Empezar'}
            </Button>
        </div>
    );
  }

  if (!currentQuestion) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4 md:p-8 rounded-lg bg-muted/50">
            <p className="text-lg font-semibold">Cargando...</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="text-center">
        <p className="text-sm font-semibold text-primary">Puntuación: {score} / {questionsAnswered}</p>
        <p className="text-lg mt-2">¿Qué emoción crees que siente esta persona?</p>
      </div>

      <Card className="w-full max-w-2xl shadow-inner bg-muted/30 overflow-hidden aspect-video">
         <div className="relative w-full h-full">
            {isLoadingImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <ImageIcon className="w-12 h-12 text-muted-foreground animate-pulse" />
                </div>
            )}
            <Image 
                src={currentQuestion.imageUrl} 
                alt={currentQuestion.hint}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={cn("object-cover transition-opacity duration-300", isLoadingImage ? "opacity-0" : "opacity-100")}
                onLoad={() => setIsLoadingImage(false)}
                data-ai-hint={currentQuestion.hint}
            />
         </div>
      </Card>
      
      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
        {currentQuestion.options.map((option) => {
            const isCorrect = option.name.toLowerCase() === currentQuestion.correctEmotion.toLowerCase();
            const isSelected = selectedAnswer?.id === option.id;

            return (
                 <Button
                    key={option.id}
                    onClick={() => handleAnswer(option)}
                    disabled={isAnswered}
                    className={cn(
                        "h-auto py-3 md:py-4 text-sm md:text-base whitespace-normal",
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
                "text-lg font-bold text-center",
                selectedAnswer?.name.toLowerCase() === currentQuestion.correctEmotion.toLowerCase() ? 'text-green-600' : 'text-destructive'
             )}>
                {selectedAnswer?.name.toLowerCase() === currentQuestion.correctEmotion.toLowerCase() ? '¡Correcto! Has ganado 5 puntos.' : `Incorrecto. La respuesta era: ${currentQuestion.correctEmotion}`}
            </p>
            <Button onClick={handleNext}>
                {questionsAnswered >= QUESTIONS_PER_GAME -1 ? 'Ver Resultados' : 'Siguiente Pregunta'}
            </Button>
        </div>
      )}
    </div>
  );
}
