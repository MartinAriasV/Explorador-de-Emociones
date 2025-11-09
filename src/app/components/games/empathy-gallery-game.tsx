
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Emotion, GameProps } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Zap, Image as ImageIcon, Loader } from 'lucide-react';
import imageData from '@/lib/placeholder-images.json';
import Image from 'next/image';
import type { User } from 'firebase/auth';
import { generateEmpathyImage } from '@/ai/flows/generate-empathy-image';

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
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const empathyImages = useMemo(() => imageData.empathy_gallery, []);
  
  const playableEmotions = useMemo(() => {
    const imageEmotions = new Set(empathyImages.map(img => img.emotion.toLowerCase()));
    return emotionsList.filter(emotion => imageEmotions.has(emotion.name.toLowerCase()));
  }, [emotionsList, empathyImages]);

  const generateQuestion = useCallback(async () => {
    if (playableEmotions.length < 4) {
        setIsPlaying(false);
        return;
    }

    setIsGeneratingImage(true);
    setError(null);

    let localHistory = [...questionHistory];
    if (localHistory.length >= empathyImages.length) {
        localHistory = [];
    }

    let possibleImages = empathyImages.filter(img => !localHistory.includes(img.id));
    if (possibleImages.length === 0) {
        possibleImages = empathyImages;
        localHistory = [];
    }
    
    const questionImageDef = shuffleArray(possibleImages)[0];
    const correctEmotion = playableEmotions.find(e => e.name.toLowerCase() === questionImageDef.emotion.toLowerCase());

    if (!correctEmotion) {
        console.error("No playable emotion found for image:", questionImageDef);
        setQuestionHistory(prev => [...prev, questionImageDef.id]);
        // Try to generate another question if there are more images left
        if (empathyImages.length > questionHistory.length + 1) {
            await generateQuestion();
        } else {
            setIsPlaying(false);
        }
        return;
    }
    
    try {
        const { imageUrl } = await generateEmpathyImage({ emotion: correctEmotion.name, hint: questionImageDef.hint });

        const incorrectOptions = shuffleArray(playableEmotions.filter(e => e.id !== correctEmotion!.id)).slice(0, 3);
        if (incorrectOptions.length < 3) {
            console.error("Not enough emotions to form a full question.");
            setIsPlaying(false);
            return;
        }
        const allOptions = shuffleArray([correctEmotion, ...incorrectOptions]);

        setCurrentQuestion({
            imageUrl: imageUrl,
            correctEmotion: correctEmotion.name,
            options: allOptions,
            hint: questionImageDef.hint
        });
        
        setQuestionHistory(prev => [...prev, questionImageDef.id]);
        setIsAnswered(false);
        setSelectedAnswer(null);

    } catch (err) {
        console.error("Error generating image:", err);
        setError("No se pudo crear una imagen. Intenta de nuevo.");
    } finally {
        setIsGeneratingImage(false);
    }
  }, [playableEmotions, empathyImages, questionHistory]);


  useEffect(() => {
    if (isPlaying && questionsAnswered < QUESTIONS_PER_GAME) {
      generateQuestion();
    } else if (questionsAnswered >= QUESTIONS_PER_GAME) {
      setIsPlaying(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, questionsAnswered]);

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
    setCurrentQuestion(null);
    setQuestionsAnswered(prev => prev + 1);
  };

  const startGame = () => {
    setScore(0);
    setQuestionsAnswered(0);
    setQuestionHistory([]);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setCurrentQuestion(null);
    setIsPlaying(true);
  };

  if (playableEmotions.length < 4) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4 md:p-8 rounded-lg bg-muted/50">
            <p className="text-lg font-semibold">¡Faltan Emociones!</p>
            <p className="max-w-md">Necesitas al menos 4 emociones diferentes en tu Emocionario (como Alegría, Tristeza, etc.) que coincidan con las imágenes del juego.</p>
        </div>
    );
  }

  if (!isPlaying) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4 md:p-8">
            <h2 className="text-2xl font-bold text-primary">Galería de Empatía</h2>
            <p className="text-muted-foreground my-4 max-w-md">Observa la imagen y adivina qué emoción representa. ¡Gana 5 puntos por cada acierto!</p>
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

  if (isGeneratingImage || !currentQuestion) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4 md:p-8 rounded-lg bg-muted/50">
            <Loader className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-lg font-semibold">Generando una imagen para ti...</p>
        </div>
    );
  }

  if (error) {
     return (
        <div className="flex flex-col items-center justify-center h-full text-center text-destructive p-4 md:p-8 rounded-lg bg-destructive/10">
            <p className="text-lg font-semibold">{error}</p>
            <Button onClick={startGame} size="lg" variant="destructive" className="mt-4">
                Reiniciar Juego
            </Button>
        </div>
     )
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="text-center">
        <p className="text-sm font-semibold text-primary">Puntuación: {score} / {questionsAnswered}</p>
        <p className="text-lg mt-2">¿Qué emoción representa mejor esta imagen?</p>
      </div>

      <Card className="w-full max-w-2xl shadow-inner bg-muted/30 overflow-hidden aspect-video">
         <div className="relative w-full h-full">
            <Image 
                src={currentQuestion.imageUrl}
                alt={currentQuestion.hint}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
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
