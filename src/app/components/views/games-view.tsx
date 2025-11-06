
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GuessEmotionGame } from '../games/guess-emotion-game';
import type { Emotion } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Puzzle } from 'lucide-react';

interface GamesViewProps {
  emotionsList: Emotion[];
}

export function GamesView({ emotionsList }: GamesViewProps) {
  return (
    <Card className="w-full h-full shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary">Juegos de Emociones</CardTitle>
        <CardDescription>Pon a prueba tus conocimientos y agudiza tu inteligencia emocional de una forma divertida.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <Tabs defaultValue="guess-emotion" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="guess-emotion">
              <Puzzle className="mr-2 h-4 w-4" /> Adivina la Emoción
            </TabsTrigger>
            <TabsTrigger value="memory" disabled>
              <Brain className="mr-2 h-4 w-4" /> Memoria Emocional
            </TabsTrigger>
          </TabsList>
          <TabsContent value="guess-emotion" className="flex-grow mt-4">
             <GuessEmotionGame emotionsList={emotionsList} />
          </TabsContent>
          <TabsContent value="memory" className="flex-grow mt-4">
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-lg bg-muted/50">
              <p className="text-lg font-semibold">¡Próximamente!</p>
              <p>Estamos trabajando en un divertido juego de memoria para ayudarte a asociar emociones.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
