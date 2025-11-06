"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { Emotion, EmotionMemoryGameProps } from '@/lib/types';
import { PREDEFINED_EMOTIONS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';

interface MemoryCard {
  id: string;
  type: 'icon' | 'name';
  content: string;
  emotionId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const CARD_COUNT = 8; // Creates 8 pairs, 16 cards total

export function EmotionMemoryGame({ emotionsList }: EmotionMemoryGameProps) {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const availableEmotions = useMemo(() => {
    const emotionMap = new Map<string, Emotion>();
    PREDEFINED_EMOTIONS.forEach(p => emotionMap.set(p.name.toLowerCase(), { ...p, id: p.name, userProfileId: 'system' } as Emotion));
    emotionsList.forEach(e => emotionMap.set(e.name.toLowerCase(), e));
    return Array.from(emotionMap.values());
  }, [emotionsList]);
  
  const setupGame = () => {
    setIsGameOver(false);
    setMoves(0);
    setFlippedCards([]);
    
    if (availableEmotions.length < CARD_COUNT) {
        setCards([]);
        return;
    }
    
    const gameEmotions = shuffleArray(availableEmotions).slice(0, CARD_COUNT);

    const gameCards: Omit<MemoryCard, 'id' | 'isFlipped' | 'isMatched'>[] = [];
    gameEmotions.forEach((emotion) => {
      gameCards.push({ type: 'icon', content: emotion.icon, emotionId: emotion.id });
      gameCards.push({ type: 'name', content: emotion.name, emotionId: emotion.id });
    });

    const shuffledCards = shuffleArray(gameCards).map((card, index) => ({
      ...card,
      id: `${card.emotionId}-${card.type}-${index}`,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(shuffledCards);
  };

  useEffect(() => {
    setupGame();
  }, [availableEmotions]);

  const handleCardClick = (index: number) => {
    if (isChecking || cards[index].isFlipped || flippedCards.length >= 2) {
      return;
    }

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      setIsChecking(true);
      const [firstIndex, secondIndex] = newFlippedCards;
      const firstCard = newCards[firstIndex];
      const secondCard = newCards[secondIndex];

      if (firstCard.emotionId === secondCard.emotionId) {
        // It's a match
        setTimeout(() => {
          setCards(prevCards => {
            const updatedCards = [...prevCards];
            updatedCards[firstIndex].isMatched = true;
            updatedCards[secondIndex].isMatched = true;
            return updatedCards;
          });
          setFlippedCards([]);
          setIsChecking(false);
        }, 800);
      } else {
        // Not a match
        setTimeout(() => {
          setCards(prevCards => {
            const updatedCards = [...prevCards];
            updatedCards[firstIndex].isFlipped = false;
            updatedCards[secondIndex].isFlipped = false;
            return updatedCards;
          });
          setFlippedCards([]);
          setIsChecking(false);
        }, 1200);
      }
    }
  };

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setIsGameOver(true);
    }
  }, [cards]);

  if (availableEmotions.length < CARD_COUNT) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-lg bg-muted/50">
        <p className="text-lg font-semibold">¡Faltan Emociones!</p>
        <p>Necesitas al menos {CARD_COUNT} emociones diferentes para jugar a este juego.</p>
        <p className="text-sm mt-2">Ve a "Descubrir" o "Emocionario" para añadir más.</p>
      </div>
    );
  }

  if (isGameOver) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h2 className="text-2xl font-bold text-primary">¡Felicidades!</h2>
            <p className="text-lg my-2">Completaste el juego en</p>
            <p className="text-5xl font-bold mb-6">{moves} movimientos</p>
            <Button onClick={setupGame}>Jugar de Nuevo</Button>
        </div>
      )
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="flex justify-between items-center w-full max-w-2xl px-2">
        <p className="text-lg font-semibold text-primary">Movimientos: {moves}</p>
        <Button variant="outline" size="icon" onClick={setupGame}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-4 w-full max-w-2xl [perspective:1000px]">
        {cards.map((card, index) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(index)}
            className={cn(
              "relative aspect-square transition-transform duration-500 cursor-pointer [transform-style:preserve-3d]",
              card.isFlipped ? '[transform:rotateY(180deg)]' : ''
            )}
          >
            {/* Card Back */}
            <div className={cn(
              "absolute w-full h-full [backface-visibility:hidden] flex items-center justify-center rounded-lg",
              "bg-primary/10 border-2 border-primary",
              card.isMatched ? "bg-green-500/20 border-green-500" : ""
            )}>
            </div>
            
            {/* Card Front */}
            <div className={cn(
               "absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center text-center p-2 rounded-lg",
               "bg-background",
               card.isMatched ? "border-2 border-green-500 opacity-70" : "border-2"
            )}>
                {card.type === 'icon' ? (
                    <span className="text-4xl md:text-5xl">{card.content}</span>
                ) : (
                    <span className="text-sm md:text-base font-semibold">{card.content}</span>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
