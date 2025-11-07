"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { Emotion, GameProps } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Play, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Drop {
  id: number;
  emotion: Emotion; // The "true" emotion of the drop
  displayEmotion: Emotion; // The currently visible emotion
  x: number;
  y: number;
  speed: number;
  color: string; // The current color of the emoji
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const GAME_WIDTH = 500;
const GAME_HEIGHT = 400;
const DROP_INTERVAL = 1200; // ms
const MAX_LIVES = 5;
const VISUAL_UPDATE_INTERVAL = 1200; // ms for color/icon change

export function EmotionRainGame({ emotionsList }: GameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [targetEmotion, setTargetEmotion] = useState<Emotion | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  
  const gameLoopRef = useRef<number>();
  const dropTimerRef = useRef<NodeJS.Timeout>();
  const visualUpdateTimerRef = useRef<NodeJS.Timeout>();

  const isPlayingRef = useRef(isPlaying);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  const targetEmotionRef = useRef(targetEmotion);
  useEffect(() => { targetEmotionRef.current = targetEmotion; }, [targetEmotion]);

  const availableEmotions = useMemo(() => {
    const uniqueEmotions = Array.from(new Map(emotionsList.map(e => [e.name, e])).values());
    return shuffleArray(uniqueEmotions);
  }, [emotionsList]);
  
  const allColors = useMemo(() => {
      if (availableEmotions.length === 0) return ['#FFFFFF'];
      return shuffleArray(availableEmotions.map(e => e.color));
  }, [availableEmotions]);

  const selectNewTarget = useCallback(() => {
    if (availableEmotions.length === 0) return;
    setTargetEmotion(prev => {
        let nextTarget;
        do {
          nextTarget = shuffleArray(availableEmotions)[0];
        } while (availableEmotions.length > 1 && nextTarget.id === prev?.id);
        return nextTarget;
    });
  }, [availableEmotions]);

  const stopGame = useCallback(() => {
    setIsPlaying(false);
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    if (dropTimerRef.current) clearInterval(dropTimerRef.current);
    if (visualUpdateTimerRef.current) clearInterval(visualUpdateTimerRef.current);
  }, []);

  const handleDropClick = (clickedDropId: number) => {
    if (!isPlayingRef.current || !targetEmotionRef.current) return;

    let correctClick = false;
    setDrops(prev => prev.filter(drop => {
      if (drop.id === clickedDropId) {
        if (drop.emotion.id === targetEmotionRef.current!.id) {
          correctClick = true;
        }
        return false; // Remove the clicked drop
      }
      return true;
    }));

    if (correctClick) {
      setScore(s => s + 1);
      selectNewTarget();
    } else {
      setLives(l => l - 1);
    }
  };
  
  const startGame = useCallback(() => {
    if (availableEmotions.length < 5) return;

    setScore(0);
    setLives(MAX_LIVES);
    setDrops([]);
    setIsGameOver(false);
    selectNewTarget();
    setIsPlaying(true);
  }, [availableEmotions, selectNewTarget]);

  const gameLoop = useCallback(() => {
    if (!isPlayingRef.current) return;
    setDrops(prevDrops => {
        const newDrops = prevDrops
            .map(drop => ({ ...drop, y: drop.y + drop.speed }))
            .filter(drop => {
                if (drop.y > GAME_HEIGHT) {
                    if (drop.emotion.id === targetEmotionRef.current?.id) {
                        setLives(l => l - 1);
                    }
                    return false;
                }
                return true;
            });
        return newDrops;
    });
    gameLoopRef.current = requestAnimationFrame(gameLoop);
}, []);

  useEffect(() => {
    if (isPlaying) {
        if (!targetEmotionRef.current) return;

        gameLoopRef.current = requestAnimationFrame(gameLoop);

        dropTimerRef.current = setInterval(() => {
            if (!isPlayingRef.current || availableEmotions.length === 0 || !targetEmotionRef.current) return;
            
            const currentTarget = targetEmotionRef.current;
            let emotionForDrop: Emotion;

            if (Math.random() < 0.4) {
                emotionForDrop = currentTarget;
            } else {
                const otherEmotions = availableEmotions.filter(e => e.id !== currentTarget.id);
                emotionForDrop = otherEmotions.length > 0 ? shuffleArray(otherEmotions)[0] : currentTarget;
            }
            
            const newDrop: Drop = {
                id: Date.now() + Math.random(),
                emotion: emotionForDrop,
                displayEmotion: emotionForDrop,
                x: Math.random() * (GAME_WIDTH - 40),
                y: -40,
                speed: 1 + Math.random() * 1.5,
                color: emotionForDrop.color,
            };
            setDrops(prev => [...prev, newDrop]);
        }, DROP_INTERVAL);

        visualUpdateTimerRef.current = setInterval(() => {
            if (!isPlayingRef.current || availableEmotions.length < 2 || !targetEmotionRef.current) return;
            const currentTargetId = targetEmotionRef.current.id;

            setDrops(prev =>
                prev.map(drop => {
                    // Only change the appearance of the target drops
                    if (drop.emotion.id === currentTargetId) {
                        return {
                            ...drop,
                            displayEmotion: shuffleArray(availableEmotions)[0],
                            color: shuffleArray(allColors)[0]
                        };
                    }
                    // Leave distractor drops unchanged
                    return drop;
                })
            );
        }, VISUAL_UPDATE_INTERVAL);
    } else {
        stopGame();
    }
    return stopGame;
  }, [isPlaying, availableEmotions, allColors, selectNewTarget, gameLoop]);


  useEffect(() => {
    if (lives <= 0 && isPlayingRef.current) {
      stopGame();
      setIsGameOver(true);
    }
  }, [lives, stopGame]);

  if (availableEmotions.length < 5) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-lg bg-muted/50">
        <p className="text-lg font-semibold">¡Faltan Emociones!</p>
        <p>Necesitas al menos 5 emociones diferentes para jugar a este juego.</p>
        <p className="text-sm mt-2">Ve a "Descubrir" o "Emocionario" para añadir más.</p>
      </div>
    );
  }

  if (!isPlaying && !isGameOver) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="text-2xl font-bold text-primary">Lluvia de Emociones</h2>
        <p className="text-muted-foreground my-4 max-w-md">El objetivo es hacer clic en el emoji que corresponde a la emoción que se te pide. ¡Cuidado! Las apariencias engañan. Tienes {MAX_LIVES} vidas.</p>
        <Button onClick={startGame} size="lg">
          <Play className="mr-2" />
          Empezar
        </Button>
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
                 color: drop.color,
                 textShadow: `0 0 8px ${drop.color}90`,
                 transition: 'color 0.3s ease, transform 0.1s ease'
             }}
             onClick={() => handleDropClick(drop.id)}
           >
             {drop.displayEmotion.icon}
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
