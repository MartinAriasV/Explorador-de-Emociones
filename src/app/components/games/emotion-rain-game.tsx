"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { Emotion, GameProps } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Play, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Drop {
  id: number;
  emotion: Emotion;
  x: number;
  y: number;
  speed: number;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const GAME_WIDTH = 500;
const GAME_HEIGHT = 400;
const INITIAL_DROP_INTERVAL = 1200; // ms
const MIN_DROP_INTERVAL = 250; // ms
const DROP_INTERVAL_DECREMENT = 50; // ms
const MAX_LIVES = 5;
const INITIAL_SPEED_MULTIPLIER = 1.0;
const SPEED_INCREMENT = 0.1;

export function EmotionRainGame({ emotionsList }: GameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [targetEmotion, setTargetEmotion] = useState<Emotion | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [speedMultiplier, setSpeedMultiplier] = useState(INITIAL_SPEED_MULTIPLIER);
  const [dropInterval, setDropInterval] = useState(INITIAL_DROP_INTERVAL);
  
  const gameLoopRef = useRef<number>();
  const dropTimerRef = useRef<NodeJS.Timeout>();

  const availableEmotions = useMemo(() => {
    const uniqueEmotions = Array.from(new Map(emotionsList.map(e => [e.name, e])).values());
    return shuffleArray(uniqueEmotions);
  }, [emotionsList]);
  
  const selectNewTarget = useCallback(() => {
    setTargetEmotion(currentTarget => {
        if (availableEmotions.length === 0) return null;
        let nextTarget;
        const otherEmotions = availableEmotions.filter(e => e.id !== currentTarget?.id);
        if (otherEmotions.length > 0) {
            nextTarget = shuffleArray(otherEmotions)[0];
        } else {
            nextTarget = availableEmotions[0];
        }
        return nextTarget;
    });
  }, [availableEmotions]);

  const handleDropClick = useCallback((clickedDropId: number) => {
    if (!isPlaying) return;

    let wasCorrect = false;
    setDrops(prev => {
        const clickedDrop = prev.find(d => d.id === clickedDropId);
        if (clickedDrop) {
            if (clickedDrop.emotion.id === targetEmotion?.id) {
                setScore(s => s + 1);
                wasCorrect = true;
            } else {
                setLives(l => l - 1);
            }
        }
        return prev.filter(drop => drop.id !== clickedDropId);
    });

    if (wasCorrect) {
        selectNewTarget();
        setSpeedMultiplier(s => s + SPEED_INCREMENT);
        setDropInterval(d => Math.max(MIN_DROP_INTERVAL, d - DROP_INTERVAL_DECREMENT));
    }
  }, [isPlaying, targetEmotion, selectNewTarget]);
  
  const stopGame = useCallback(() => {
      setIsPlaying(false);
      if(gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if(dropTimerRef.current) clearTimeout(dropTimerRef.current);
  }, []);
  
  const startGame = useCallback(() => {
    if (availableEmotions.length < 5) return;
    setScore(0);
    setLives(MAX_LIVES);
    setDrops([]);
    setIsGameOver(false);
    setSpeedMultiplier(INITIAL_SPEED_MULTIPLIER);
    setDropInterval(INITIAL_DROP_INTERVAL);
    
    selectNewTarget();
    setIsPlaying(true);
    
  }, [availableEmotions.length, selectNewTarget]);


  useEffect(() => {
    if (lives <= 0 && isPlaying) {
      stopGame();
      setIsGameOver(true);
    }
  }, [lives, isPlaying, stopGame]);

  useEffect(() => {
    if (!isPlaying || !targetEmotion) {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if (dropTimerRef.current) clearTimeout(dropTimerRef.current);
      return;
    }

    const gameLoop = () => {
      setDrops(prevDrops => {
        const newDrops = prevDrops
            .map(drop => ({
                ...drop,
                y: drop.y + drop.speed * speedMultiplier,
            }))
            .filter(drop => {
                if (drop.y > GAME_HEIGHT) {
                    if (drop.emotion.id === targetEmotion?.id) {
                        setLives(l => Math.max(0, l - 1));
                    }
                    return false;
                }
                return true;
            });
        return newDrops;
      });
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    gameLoopRef.current = requestAnimationFrame(gameLoop);

    const createDrop = () => {
        setDrops(prev => {
            if (!targetEmotion || availableEmotions.length === 0) return prev;

            let emotionForDrop: Emotion;
            if (Math.random() < 0.4) {
                emotionForDrop = targetEmotion;
            } else {
                const otherEmotions = availableEmotions.filter(e => e.id !== targetEmotion.id);
                emotionForDrop = otherEmotions.length > 0 ? shuffleArray(otherEmotions)[0] : targetEmotion;
            }
            
            const newDrop: Drop = {
                id: Date.now() + Math.random(),
                emotion: emotionForDrop,
                x: Math.random() * (GAME_WIDTH - 40),
                y: -40,
                speed: 1 + Math.random() * 1.5,
            };
            return [...prev, newDrop];
        });
    }

    const scheduleNextDrop = () => {
      dropTimerRef.current = setTimeout(() => {
        if (!isPlaying) return;
        createDrop();
        scheduleNextDrop();
      }, dropInterval);
    };

    scheduleNextDrop();

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if (dropTimerRef.current) clearTimeout(dropTimerRef.current);
    };
  }, [isPlaying, targetEmotion, availableEmotions, speedMultiplier, dropInterval]);

  if (availableEmotions.length < 5) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-lg bg-muted/50">
        <p className="text-lg font-semibold">¡Faltan Emociones!</p>
        <p>Necesitas al menos 5 emociones diferentes para jugar a este juego.</p>
        <p className="text-sm mt-2">Ve a "Descubrir" o "Emocionario" para añadir más.</p>
      </div>
    );
  }

  if (isGameOver) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h2 className="text-2xl font-bold text-primary">Lluvia de Emociones</h2>
            <p className="text-lg my-2">¡Juego terminado!</p>
            <p className="text-5xl font-bold mb-6">{score}</p>
            <p className="text-muted-foreground mb-6 -mt-4">puntos</p>
            <Button onClick={startGame} size="lg">
              <RotateCw className="mr-2" />
              Jugar de Nuevo
            </Button>
          </div>
      )
  }

  if (!isPlaying) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="text-2xl font-bold text-primary">Lluvia de Emociones</h2>
        <p className="text-muted-foreground my-4 max-w-md">El objetivo es hacer clic en el emoji que corresponde a la emoción que se te pide. La velocidad y la cantidad aumentarán con cada acierto. Tienes {MAX_LIVES} vidas.</p>
        <Button onClick={startGame} size="lg">
          <Play className="mr-2" />
          Empezar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
       <div className="w-full max-w-[500px] flex justify-between items-center text-lg font-semibold">
           <p>Puntuación: <span className="text-primary">{score}</span></p>
           <p>Vidas: <span className="text-destructive">{'❤️'.repeat(Math.max(0, lives))}</span></p>
       </div>

       <div 
         className="relative bg-muted/20 rounded-lg overflow-hidden border-2"
         style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
       >
         {drops.map(drop => (
           <div
             key={drop.id}
             className="absolute text-4xl cursor-pointer hover:scale-110 transition-transform"
             style={{ 
                 left: drop.x, 
                 top: drop.y, 
                 color: drop.emotion.color,
                 textShadow: `0 0 8px ${drop.emotion.color}90`,
             }}
             onClick={() => handleDropClick(drop.id)}
           >
             {drop.emotion.icon}
           </div>
         ))}
       </div>

        <div className="text-center p-4 rounded-lg bg-muted/50">
            <p className="text-muted-foreground">Busca esta emoción:</p>
            <p className="text-2xl font-bold text-primary flex items-center gap-2">
                <span>{targetEmotion?.icon}</span>
                <span>{targetEmotion?.name}</span>
            </p>
        </div>
    </div>
  );
}
