
"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { Emotion, GameProps } from '@/lib/types';
import { Button } from '@/components/ui/button';
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
const MAX_LIVES = 5;

export function EmotionRainGame({ emotionsList }: GameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [targetEmotion, setTargetEmotion] = useState<Emotion | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const gameLoopRef = useRef<number>();
  const dropTimerRef = useRef<number>();

  const availableEmotions = useMemo(() => {
    // Prioritize verified emotions, but allow custom ones if not enough verified ones are available.
    const verified = emotionsList.filter(e => !e.isCustom);
    const custom = emotionsList.filter(e => e.isCustom);
    if (verified.length >= 5) return verified;
    return [...verified, ...shuffleArray(custom)].slice(0, 5);
  }, [emotionsList]);

  const selectNewTarget = useCallback(() => {
    setTargetEmotion(shuffleArray(availableEmotions)[0]);
  }, [availableEmotions]);
  
  const startGame = useCallback(() => {
    setScore(0);
    setLives(MAX_LIVES);
    setDrops([]);
    setIsPlaying(true);
    selectNewTarget();

    const addDrop = () => {
      if (!targetEmotion || availableEmotions.length === 0) return;
      
      let emotionForDrop: Emotion;
      // Make the target emotion appear more frequently
      if (Math.random() > 0.4) { // 60% chance to be the target emotion
          emotionForDrop = targetEmotion;
      } else {
          emotionForDrop = shuffleArray(availableEmotions.filter(e => e.id !== targetEmotion.id))[0] || targetEmotion;
      }

      const newDrop: Drop = {
        id: Date.now() + Math.random(),
        emotion: emotionForDrop,
        x: Math.random() * (GAME_WIDTH - 40),
        y: -40,
        speed: 1 + Math.random() * 1.5,
      };
      setDrops(prev => [...prev, newDrop]);
    };
    
    const gameLoop = () => {
      setDrops(prevDrops => {
        const newDrops = prevDrops
          .map(drop => ({ ...drop, y: drop.y + drop.speed }))
          .filter(drop => {
            if (drop.y > GAME_HEIGHT) {
              if (drop.emotion.id === targetEmotion?.id) {
                setLives(l => l - 1);
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
    dropTimerRef.current = window.setInterval(addDrop, DROP_INTERVAL);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableEmotions, selectNewTarget, targetEmotion]);
  
  const stopGame = useCallback(() => {
    setIsPlaying(false);
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    if (dropTimerRef.current) clearInterval(dropTimerRef.current);
  }, []);

  useEffect(() => {
    if (lives <= 0) {
      stopGame();
    }
  }, [lives, stopGame]);
  
  useEffect(() => {
    return () => stopGame();
  }, [stopGame]);

  if (availableEmotions.length < 5) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-lg bg-muted/50">
        <p className="text-lg font-semibold">¡Faltan Emociones!</p>
        <p>Necesitas al menos 5 emociones diferentes para jugar a este juego.</p>
      </div>
    );
  }

  if (!isPlaying) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="text-2xl font-bold text-primary">Lluvia de Emociones</h2>
        {score > 0 || lives < MAX_LIVES ? (
          <>
            <p className="text-lg my-2">¡Juego terminado!</p>
            <p className="text-5xl font-bold mb-6">{score}</p>
            <p className="text-muted-foreground mb-6 -mt-4">puntos</p>
          </>
        ) : (
          <p className="text-muted-foreground my-4 max-w-md">El objetivo es hacer clic en el emoji que corresponde a la emoción que se te pide. ¡Cuidado! Si dejas escapar la emoción correcta o haces clic en la incorrecta, pierdes una vida.</p>
        )}
        <Button onClick={startGame} size="lg">
          {score > 0 || lives < MAX_LIVES ? <RotateCw className="mr-2" /> : <Play className="mr-2" />}
          {score > 0 || lives < MAX_LIVES ? 'Jugar de Nuevo' : 'Empezar'}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
       <div className="w-full max-w-[500px] flex justify-between items-center text-lg font-semibold">
           <p>Puntuación: <span className="text-primary">{score}</span></p>
           <p>Vidas: <span className="text-destructive">{'❤️'.repeat(lives)}</span></p>
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
