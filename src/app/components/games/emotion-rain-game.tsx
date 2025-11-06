
"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { Emotion, GameProps } from '@/lib/types';
import { PREDEFINED_EMOTIONS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Play, RotateCw } from 'lucide-react';

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
const DROP_INTERVAL = 1200; // ms

export function EmotionRainGame({ emotionsList }: GameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [targetEmotion, setTargetEmotion] = useState<Emotion | null>(null);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const gameLoopRef = useRef<number>();
  const dropTimerRef = useRef<NodeJS.Timeout>();

  const availableEmotions = useMemo(() => {
    const emotionMap = new Map<string, Emotion>();
    PREDEFINED_EMOTIONS.forEach(p => emotionMap.set(p.name.toLowerCase(), { ...p, id: p.name, userProfileId: 'system' } as Emotion));
    emotionsList.forEach(e => emotionMap.set(e.name.toLowerCase(), e));
    return Array.from(emotionMap.values());
  }, [emotionsList]);

  const selectNewTarget = useCallback(() => {
    setTargetEmotion(shuffleArray(availableEmotions)[0]);
  }, [availableEmotions]);
  
  const startGame = () => {
    setScore(0);
    setMissed(0);
    setDrops([]);
    setIsPlaying(true);
    selectNewTarget();

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    dropTimerRef.current = setInterval(() => {
        addDrop();
    }, DROP_INTERVAL);
  };
  
  const stopGame = () => {
      setIsPlaying(false);
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if (dropTimerRef.current) clearInterval(dropTimerRef.current);
  }

  const addDrop = () => {
    if(availableEmotions.length === 0) return;
    const newDrop: Drop = {
        id: Date.now() + Math.random(),
        emotion: shuffleArray(availableEmotions)[0],
        x: Math.random() * (GAME_WIDTH - 40),
        y: -40,
        speed: 1 + Math.random() * 1.5
    };
    setDrops(prev => [...prev, newDrop]);
  };
  
  const gameLoop = () => {
    setDrops(prevDrops => {
      const newDrops = prevDrops
        .map(drop => ({ ...drop, y: drop.y + drop.speed }))
        .filter(drop => {
            if(drop.y > GAME_HEIGHT) {
                if (drop.emotion.id === targetEmotion?.id) {
                    setMissed(m => m + 1);
                }
                return false;
            }
            return true;
        });
      return newDrops;
    });
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  const handleDropClick = (clickedDrop: Drop) => {
    if(clickedDrop.emotion.id === targetEmotion?.id){
        setScore(s => s + 1);
        selectNewTarget();
    } else {
        setMissed(m => m + 1);
    }
    setDrops(prev => prev.filter(d => d.id !== clickedDrop.id));
  }

  useEffect(() => {
      if(missed >= 5) {
          stopGame();
      }
  }, [missed]);
  
  useEffect(() => {
      // Cleanup on unmount
      return () => stopGame();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (availableEmotions.length < 5) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-lg bg-muted/50">
        <p className="text-lg font-semibold">¡Faltan Emociones!</p>
        <p>Necesitas al menos 5 emociones para jugar a este juego.</p>
      </div>
    );
  }

  if (!isPlaying) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="text-2xl font-bold text-primary">Lluvia de Emociones</h2>
        {score > 0 || missed > 0 ? (
          <>
            <p className="text-lg my-2">¡Juego terminado!</p>
            <p className="text-5xl font-bold mb-6">{score}</p>
             <p className="text-muted-foreground mb-6 -mt-4">puntos</p>
          </>
        ) : (
          <p className="text-muted-foreground my-4 max-w-md">¡Reflejos rápidos! Haz clic en los emojis correctos a medida que caen. ¡No dejes que se te escapen! Tienes 5 vidas.</p>
        )}
        <Button onClick={startGame} size="lg">
          {score > 0 || missed > 0 ? <RotateCw className="mr-2" /> : <Play className="mr-2" />}
          {score > 0 || missed > 0 ? 'Jugar de Nuevo' : 'Empezar'}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
       <div className="w-full max-w-[500px] flex justify-between items-center text-lg font-semibold">
           <p>Puntuación: <span className="text-primary">{score}</span></p>
           <p>Vidas: <span className="text-destructive">{'❤️'.repeat(5 - missed)}</span></p>
       </div>

       <div 
         className="relative bg-muted/20 rounded-lg overflow-hidden border-2"
         style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
       >
         {drops.map(drop => (
           <div
             key={drop.id}
             className="absolute text-4xl cursor-pointer hover:scale-110 transition-transform"
             style={{ left: drop.x, top: drop.y }}
             onClick={() => handleDropClick(drop)}
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

