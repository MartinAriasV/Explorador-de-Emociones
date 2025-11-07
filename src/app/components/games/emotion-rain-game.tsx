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
  isRevealed: boolean; // New state to track if the true form is shown
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const GAME_WIDTH = 500;
const GAME_HEIGHT = 400;
const DROP_INTERVAL = 1200; // ms
const MAX_LIVES = 5;
const VISUAL_UPDATE_INTERVAL = 2500; // ms for color/icon change (slowed down)
const REVEAL_THRESHOLD = GAME_HEIGHT - 60; // When to reveal the true form

export function EmotionRainGame({ emotionsList }: GameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [targetEmotion, setTargetEmotion] = useState<Emotion | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  
  const gameLoopRef = useRef<number>();
  const dropTimerRef = useRef<number>();
  const visualUpdateTimerRef = useRef<number>();

  const availableEmotions = useMemo(() => {
    const uniqueEmotions = Array.from(new Map(emotionsList.map(e => [e.name, e])).values());
    return shuffleArray(uniqueEmotions);
  }, [emotionsList]);
  
  const allColors = useMemo(() => {
      if (availableEmotions.length === 0) return ['#FFFFFF'];
      return shuffleArray(availableEmotions.map(e => e.color));
  }, [availableEmotions]);

  const selectNewTarget = useCallback(() => {
    if (availableEmotions.length === 0) return null;
    let nextTarget;
    const otherEmotions = availableEmotions.filter(e => e.id !== targetEmotion?.id);
    if (otherEmotions.length > 0) {
        nextTarget = shuffleArray(otherEmotions)[0];
    } else {
        nextTarget = availableEmotions[0];
    }
    setTargetEmotion(nextTarget);
    return nextTarget;
  }, [availableEmotions, targetEmotion]);

  const handleDropClick = useCallback((clickedDropId: number) => {
    if (!isPlaying) return;

    setDrops(prev => {
        const clickedDrop = prev.find(d => d.id === clickedDropId);
        if (clickedDrop) {
            if (clickedDrop.emotion.id === targetEmotion?.id) {
                setScore(s => s + 1);
                selectNewTarget();
            } else {
                setLives(l => l - 1);
            }
        }
        return prev.filter(drop => drop.id !== clickedDropId);
    });
  }, [isPlaying, selectNewTarget, targetEmotion]);
  
  const stopGame = useCallback(() => {
      setIsPlaying(false);
      if(gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if(dropTimerRef.current) clearInterval(dropTimerRef.current);
      if(visualUpdateTimerRef.current) clearInterval(visualUpdateTimerRef.current);
  }, []);
  
  const startGame = useCallback(() => {
    if (availableEmotions.length < 5) return;
    setScore(0);
    setLives(MAX_LIVES);
    setDrops([]);
    setIsGameOver(false);
    
    // Ensure we have a target before starting the game
    const initialTarget = selectNewTarget();
    if(initialTarget) {
        setIsPlaying(true);
    }
  }, [availableEmotions.length, selectNewTarget]);


  useEffect(() => {
    if (lives <= 0 && isPlaying) {
      stopGame();
      setIsGameOver(true);
    }
  }, [lives, isPlaying, stopGame]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    // --- Game Animation Loop ---
    const gameLoop = () => {
      setDrops(prevDrops => {
        const newDrops = prevDrops
            .map(drop => {
                const newY = drop.y + drop.speed;
                let isRevealed = drop.isRevealed;
                // Reveal the true form if it's a target and near the bottom
                if (drop.emotion.id === targetEmotion?.id && newY > REVEAL_THRESHOLD && !drop.isRevealed) {
                    isRevealed = true;
                }

                return { 
                    ...drop, 
                    y: newY,
                    isRevealed,
                    displayEmotion: isRevealed ? drop.emotion : drop.displayEmotion,
                    color: isRevealed ? drop.emotion.color : drop.color,
                };
            })
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

    // --- Drop Creation Interval ---
    dropTimerRef.current = window.setInterval(() => {
        setDrops(prev => {
            if (!targetEmotion || availableEmotions.length === 0) return prev;

            let emotionForDrop: Emotion;
            if (Math.random() < 0.4) { // 40% chance to be the target
                emotionForDrop = targetEmotion;
            } else {
                const otherEmotions = availableEmotions.filter(e => e.id !== targetEmotion.id);
                emotionForDrop = otherEmotions.length > 0 ? shuffleArray(otherEmotions)[0] : targetEmotion;
            }
            
            const newDrop: Drop = {
                id: Date.now() + Math.random(),
                emotion: emotionForDrop,
                displayEmotion: emotionForDrop,
                x: Math.random() * (GAME_WIDTH - 40),
                y: -40,
                speed: 1 + Math.random() * 1.5,
                color: emotionForDrop.color,
                isRevealed: false,
            };
            return [...prev, newDrop];
        });
    }, DROP_INTERVAL);

    // --- Visual Update Interval ---
    visualUpdateTimerRef.current = window.setInterval(() => {
        setDrops(prev => 
            prev.map(drop => {
                // Only change appearance if it's a target and not yet revealed
                if (drop.emotion.id === targetEmotion?.id && !drop.isRevealed && availableEmotions.length > 1) {
                    const otherEmotions = availableEmotions.filter(e => e.id !== drop.emotion.id);
                    return {
                        ...drop,
                        displayEmotion: shuffleArray(otherEmotions)[0],
                        color: shuffleArray(allColors)[0]
                    };
                }
                return drop;
            })
        );
    }, VISUAL_UPDATE_INTERVAL);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if (dropTimerRef.current) clearInterval(dropTimerRef.current);
      if (visualUpdateTimerRef.current) clearInterval(visualUpdateTimerRef.current);
    };
  }, [isPlaying, targetEmotion, availableEmotions, allColors]);

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
        <p className="text-muted-foreground my-4 max-w-md">El objetivo es hacer clic en el emoji que corresponde a la emoción que se te pide. ¡Cuidado! Las apariencias engañan. Tienes {MAX_LIVES} vidas.</p>
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
