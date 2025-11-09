"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GuessEmotionGame } from '../games/guess-emotion-game';
import type { Emotion, UserProfile } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Puzzle, Feather, Contrast, CloudRain, BookMarked, Users, Rocket } from 'lucide-react';
import { EmotionMemoryGame } from '../games/emotion-memory-game';
import { QuickJournalGame } from '../games/quick-journal-game';
import { AntonymGame } from '../games/antonym-game';
import { EmotionRainGame } from '../games/emotion-rain-game';
import { StoryBuilderGame } from '../games/story-builder-game';
import type { User } from 'firebase/auth';
import { EmpathyGalleryGame } from '../games/empathy-gallery-game';
import { EmotionalAscentGame } from '../games/emotional-ascent-game';

interface GamesViewProps {
  emotionsList: Emotion[];
  userProfile: UserProfile;
  addPoints: (amount: number) => void;
  user: User;
  onAscentGameEnd: (score: number) => void;
}

export function GamesView({ emotionsList, userProfile, addPoints, user, onAscentGameEnd }: GamesViewProps) {
  return (
    <Card className="w-full h-full shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary">Juegos de Emociones</CardTitle>
        <CardDescription>Pon a prueba tus conocimientos y agudiza tu inteligencia emocional de una forma divertida.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <Tabs defaultValue="guess-emotion" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 h-auto">
            <TabsTrigger value="guess-emotion" className="py-2">
              <Puzzle className="mr-2 h-4 w-4" /> Adivina
            </TabsTrigger>
            <TabsTrigger value="memory" className="py-2">
              <Brain className="mr-2 h-4 w-4" /> Memoria
            </TabsTrigger>
             <TabsTrigger value="empathy-gallery" className="py-2">
              <Users className="mr-2 h-4 w-4" /> Empatía
            </TabsTrigger>
            <TabsTrigger value="quick-journal" className="py-2">
              <Feather className="mr-2 h-4 w-4" /> Diario Rápido
            </TabsTrigger>
            <TabsTrigger value="antonyms" className="py-2">
              <Contrast className="mr-2 h-4 w-4" /> Antónimos
            </TabsTrigger>
             <TabsTrigger value="rain-game" className="py-2">
              <CloudRain className="mr-2 h-4 w-4" /> Lluvia
            </TabsTrigger>
            <TabsTrigger value="story-builder" className="py-2">
              <BookMarked className="mr-2 h-4 w-4" /> Historias
            </TabsTrigger>
            <TabsTrigger value="ascent-game" className="py-2">
              <Rocket className="mr-2 h-4 w-4" /> Ascenso
            </TabsTrigger>
          </TabsList>
          <TabsContent value="guess-emotion" className="flex-grow mt-4">
             <GuessEmotionGame emotionsList={emotionsList} userProfile={userProfile} />
          </TabsContent>
          <TabsContent value="memory" className="flex-grow mt-4">
            <EmotionMemoryGame emotionsList={emotionsList} userProfile={userProfile} />
          </TabsContent>
          <TabsContent value="empathy-gallery" className="flex-grow mt-4">
            <EmpathyGalleryGame emotionsList={emotionsList} addPoints={addPoints} user={user} userProfile={userProfile} />
          </TabsContent>
          <TabsContent value="quick-journal" className="flex-grow mt-4">
            <QuickJournalGame emotionsList={emotionsList} userProfile={userProfile} />
          </TabsContent>
          <TabsContent value="antonyms" className="flex-grow mt-4">
            <AntonymGame emotionsList={emotionsList} userProfile={userProfile} />
          </TabsContent>
          <TabsContent value="rain-game" className="flex-grow mt-4">
            <EmotionRainGame emotionsList={emotionsList} userProfile={userProfile} />
          </TabsContent>
          <TabsContent value="story-builder" className="flex-grow mt-4">
            <StoryBuilderGame emotionsList={emotionsList} addPoints={addPoints} user={user} userProfile={userProfile} />
          </TabsContent>
          <TabsContent value="ascent-game" className="flex-grow mt-4">
            <EmotionalAscentGame emotionsList={emotionsList} userProfile={userProfile} onGameEnd={onAscentGameEnd} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
