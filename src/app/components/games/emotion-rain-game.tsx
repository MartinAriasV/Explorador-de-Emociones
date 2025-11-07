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
  const dropTimerRef = useRef<NodeJS.Timeout>();

  const availableEmotions = useMemo(() => {
    // We need at least 5 emotions to make the game challenging.
    const uniqueEmotions = Array.from(new Map(emotionsList.map(e => [e.name, e])).values());
    if (uniqueEmotions.length < 5) return [];
    return shuffleArray(uniqueEmotions);
  }, [emotionsList]);

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
  }, []);
  
  const decrementLives = useCallback(() => {
    setLives(l => {
      // Only decrement if the game is still playing and lives are > 0
      if (!isPlaying || l <= 0) return l;
      
      const newLives = l - 1;
      if (newLives <= 0) {
        stopGame();
      }
      return newLives;
    });
  }, [isPlaying, stopGame]);


  const startGame = useCallback(() => {
    if (availableEmotions.length < 5) return;

    setScore(0);
    setLives(MAX_LIVES);
    setDrops([]);
    setIsPlaying(true);
    
    // Select initial target
    const initialTarget = shuffleArray(availableEmotions)[0];
    setTargetEmotion(initialTarget);

    // Game loop for updating drop positions
    const gameLoop = () => {
        setDrops(prevDrops => {
          const newDrops = prevDrops
            .map(drop => ({ ...drop, y: drop.y + drop.speed }))
            .filter(drop => {
              if (drop.y > GAME_HEIGHT) {
                // If a target drop was missed, decrement lives
                if (drop.emotion.id === targetEmotion?.id) {
                    decrementLives();
                }
                return false; // Remove drop that went off-screen
              }
              return true;
            });
          return newDrops;
        });
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      };
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    
    // Timer for adding new drops
    dropTimerRef.current = setInterval(() => {
      if (availableEmotions.length === 0) return;
      
      setTargetEmotion(currentTarget => {
        if (!currentTarget) return currentTarget;
        
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
          x: Math.random() * (GAME_WIDTH - 40),
          y: -40,
          speed: 1 + Math.random() * 1.5,
        };

        setDrops(prev => [...prev, newDrop]);
        return currentTarget;
      });
    }, DROP_INTERVAL);

  }, [availableEmotions, stopGame, decrementLives]);

  const handleDropClick = (clickedDrop: Drop) => {
    if (!isPlaying || !targetEmotion) return;

    if (clickedDrop.emotion.id === targetEmotion.id) {
      setScore(s => s + 1);
      selectNewTarget();
    } else {
      decrementLives();
    }

    setDrops(prev => prev.filter(drop => drop.id !== clickedDrop.id));
  };
  
  useEffect(() => {
    // Cleanup on unmount
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
