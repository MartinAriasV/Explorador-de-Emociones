
"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { Emotion, GameProps } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Timer, Zap, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { EMOTION_BONUS_WORDS } from '@/lib/constants';

const GAME_DURATION = 45; // seconds
const TIME_BONUS = 3; // seconds

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export function QuickJournalGame({ emotionsList }: GameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [targetEmotion, setTargetEmotion] = useState<Emotion | null>(null);
  const [bonusWord, setBonusWord] = useState<string>('');
  const [thought, setThought] = useState('');
  const [showTimeBonus, setShowTimeBonus] = useState(false);
  const timerRef = useRef<number | null>(null);

  const availableEmotions = useMemo(() => {
    // Filter emotions that have bonus words available
    return emotionsList.filter(e => EMOTION_BONUS_WORDS[e.name]);
  }, [emotionsList]);

  const selectNewTarget = useCallback(() => {
    if (availableEmotions.length === 0) return;
    
    let nextEmotion = shuffleArray(availableEmotions)[0];
    // Avoid picking the same emotion twice in a row if possible
    if (nextEmotion.id === targetEmotion?.id && availableEmotions.length > 1) {
      nextEmotion = shuffleArray(availableEmotions.filter(e => e.id !== targetEmotion.id))[0];
    }
    
    setTargetEmotion(nextEmotion);
    const possibleWords = EMOTION_BONUS_WORDS[nextEmotion.name];
    setBonusWord(shuffleArray(possibleWords)[0]);
  }, [availableEmotions, targetEmotion]);

  const stopTimer = () => {
    if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
    }
  }

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = window.setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft <= 0) {
      setIsPlaying(false);
      stopTimer();
    }
    return stopTimer;
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setIsPlaying(true);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setThought('');
    selectNewTarget();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thought) return;

    if (thought.toLowerCase().includes(bonusWord.toLowerCase())) {
        setTimeLeft(prev => prev + TIME_BONUS);
        setShowTimeBonus(true);
        setTimeout(() => setShowTimeBonus(false), 1000);
    }

    setScore(score + 1);
    setThought('');
    selectNewTarget();
  };

  if (availableEmotions.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4 md:p-8 rounded-lg bg-muted/50">
            <p className="text-lg font-semibold">¡Faltan Emociones!</p>
            <p className="max-w-md">Necesitas al menos 1 emoción con palabras clave para jugar.</p>
             <p className="text-sm mt-2">Asegúrate de tener emociones como 'Alegría', 'Tristeza', etc. desde la sección "Descubrir".</p>
        </div>
    )
  }

  if (!isPlaying) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4 md:p-8">
        <h2 className="text-2xl font-bold text-primary">Diario Rápido</h2>
        {score > 0 ? (
          <>
            <p className="text-lg my-2">¡Juego terminado!</p>
            <p className="text-5xl font-bold mb-2">{score}</p>
            <p className="text-muted-foreground mb-6">entradas registradas.</p>
          </>
        ) : (
          <p className="text-muted-foreground my-4 max-w-md">El objetivo es escribir un pensamiento rápido sobre la emoción que aparece. Si usas la "Palabra Clave", ¡ganas tiempo extra! Anota tantos como puedas.</p>
        )}
        <Button onClick={startGame} size="lg">
          <Zap className="mr-2" />
          {score > 0 ? 'Jugar de Nuevo' : 'Empezar'}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="w-full max-w-2xl space-y-4">
        <div className="flex justify-between items-center w-full px-2 relative">
          <p className="text-lg font-semibold text-primary">Puntuación: {score}</p>
          <div className="flex items-center gap-2 text-xl font-bold text-destructive">
            <Timer />
            <span>{timeLeft}s</span>
          </div>
           {showTimeBonus && (
            <div className="absolute right-0 -top-8 flex items-center gap-1 text-green-500 font-bold animate-fade-in-up">
                <Sparkles className="h-5 w-5" />
                <span>+{TIME_BONUS}s</span>
            </div>
           )}
        </div>
        <Progress value={(timeLeft / GAME_DURATION) * 100} className="w-full h-2" />
      </div>

      <Card className="w-full max-w-2xl p-6 text-center shadow-inner bg-muted/30">
        <CardContent className="p-0">
          {targetEmotion ? (
            <div className="text-2xl md:text-3xl font-bold flex flex-col items-center justify-center gap-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl md:text-5xl">{targetEmotion.icon}</span>
                <span>{targetEmotion.name}</span>
              </div>
              <div className="text-base md:text-lg mt-2 font-normal text-muted-foreground">
                Palabra clave: <span className="font-bold text-accent">{bonusWord}</span>
              </div>
            </div>
          ) : (
             <p>Cargando emoción...</p>
          )}
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
        <Input
          type="text"
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder="Escribe un pensamiento que incluya la palabra clave..."
          className="text-base md:text-lg h-12 text-center"
          required
          autoFocus
        />
        <Button type="submit" className="w-full" disabled={!thought}>
          Registrar y Siguiente
        </Button>
      </form>
    </div>
  );
}
