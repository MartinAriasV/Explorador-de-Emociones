
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { Emotion, GameProps } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Timer, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

const GAME_DURATION = 30; // 30 seconds

export function QuickJournalGame({ emotionsList }: GameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [selectedEmotionId, setSelectedEmotionId] = useState('');
  const [thought, setThought] = useState('');
  const timerRef = useRef<number | null>(null);

  const availableEmotions = useMemo(() => {
    return [...emotionsList].sort((a, b) => a.name.localeCompare(b.name));
  }, [emotionsList]);

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
    setSelectedEmotionId('');
    setThought('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmotionId || !thought) return;
    setScore(score + 1);
    setSelectedEmotionId('');
    setThought('');
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
          <p className="text-muted-foreground my-4 max-w-md">¿Qué tan rápido puedes identificar y anotar tus sentimientos? Registra tantas emociones y pensamientos como puedas en 30 segundos.</p>
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
        <div className="flex justify-between items-center w-full px-2">
          <p className="text-lg font-semibold text-primary">Puntuación: {score}</p>
          <div className="flex items-center gap-2 text-xl font-bold text-destructive">
            <Timer />
            <span>{timeLeft}s</span>
          </div>
        </div>
        <Progress value={(timeLeft / GAME_DURATION) * 100} className="w-full h-2" />
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
        <Select value={selectedEmotionId} onValueChange={setSelectedEmotionId} required>
          <SelectTrigger className="w-full text-lg h-12">
            <SelectValue placeholder="Elige una emoción..." />
          </SelectTrigger>
          <SelectContent>
            {availableEmotions.map((emotion) => (
              <SelectItem key={emotion.id} value={emotion.id}>
                <div className="flex items-center gap-2">
                  <span>{emotion.icon}</span>
                  <span>{emotion.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="text"
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder="Un pensamiento rápido sobre por qué te sientes así..."
          className="text-lg h-12"
          required
        />
        <Button type="submit" className="w-full" disabled={!selectedEmotionId || !thought}>
          Registrar
        </Button>
      </form>
    </div>
  );
}
