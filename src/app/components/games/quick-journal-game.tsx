
"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { Emotion, GameProps } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Timer, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';

const GAME_DURATION = 30; // 30 seconds

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export function QuickJournalGame({ emotionsList }: GameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [targetEmotion, setTargetEmotion] = useState<Emotion | null>(null);
  const [thought, setThought] = useState('');
  const timerRef = useRef<number | null>(null);

  const availableEmotions = useMemo(() => {
    return [...emotionsList].sort((a, b) => a.name.localeCompare(b.name));
  }, [emotionsList]);

  const selectNewTarget = useCallback(() => {
    if (availableEmotions.length === 0) return;
    const shuffled = shuffleArray(availableEmotions);
    // Avoid picking the same emotion twice in a row if possible
    if (shuffled[0].id === targetEmotion?.id && shuffled.length > 1) {
      setTargetEmotion(shuffled[1]);
    } else {
      setTargetEmotion(shuffled[0]);
    }
  }, [availableEmotions, targetEmotion]);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = window.setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
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
    setScore(score + 1);
    setThought('');
    selectNewTarget();
  };

  if (!isPlaying) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="text-2xl font-bold text-primary">Diario Rápido</h2>
        {score > 0 ? (
          <>
            <p className="text-lg my-2">¡Juego terminado!</p>
            <p className="text-5xl font-bold mb-2">{score}</p>
            <p className="text-muted-foreground mb-6">entradas registradas en {GAME_DURATION} segundos.</p>
          </>
        ) : (
          <p className="text-muted-foreground my-4 max-w-md">Una emoción aparecerá en pantalla. Escribe rápidamente un pensamiento asociado antes de que se acabe el tiempo.</p>
        )}
        <Button onClick={startGame} size="lg" disabled={availableEmotions.length === 0}>
          <Zap className="mr-2" />
          {availableEmotions.length === 0 ? 'Añade emociones para jugar' : (score > 0 ? 'Jugar de Nuevo' : 'Empezar')}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="w-full max-w-2xl space-y-4">
        <div className="flex justify-between items-center w-full px-2">
          <p className="text-lg font-semibold text-primary">Puntuación: {score}</p>
          <div className="flex items-center gap-2 text-xl font-bold text-destructive">
            <Timer />
            <span>{timeLeft}s</span>
          </div>
        </div>
        <Progress value={(timeLeft / GAME_DURATION) * 100} className="w-full h-2" />
      </div>

      <Card className="w-full max-w-2xl p-6 text-center shadow-inner bg-muted/30">
        <CardContent className="p-0">
          {targetEmotion ? (
            <div className="text-3xl font-bold flex flex-col items-center justify-center gap-2">
              <span style={{color: targetEmotion.color}}>Anota un pensamiento sobre:</span>
              <div className="flex items-center gap-3">
                <span className="text-5xl">{targetEmotion.icon}</span>
                <span>{targetEmotion.name}</span>
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
          placeholder="Un pensamiento rápido sobre esta emoción..."
          className="text-lg h-12 text-center"
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
