"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle } from 'lucide-react';
import { PREDEFINED_EMOTIONS } from '@/lib/constants';
import { PredefinedEmotion } from '@/lib/types';

interface DiscoverViewProps {
  onAddEmotion: (emotionData: Omit<PredefinedEmotion, 'example'>) => void;
}

export function DiscoverView({ onAddEmotion }: DiscoverViewProps) {
  return (
    <Card className="w-full h-full shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Descubrir Emociones</CardTitle>
        <CardDescription>Explora nuevas emociones y añádelas a tu propio emocionario para un seguimiento más detallado.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4 -mr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PREDEFINED_EMOTIONS.map((emotion) => (
              <Card key={emotion.name} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{emotion.icon}</span>
                    <CardTitle className="text-xl text-primary">{emotion.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground mb-2">{emotion.description}</p>
                  <p className="text-sm text-muted-foreground italic">"{emotion.example}"</p>
                </CardContent>
                <div className="p-4 pt-0 mt-auto">
                    <Button 
                        onClick={() => onAddEmotion({ name: emotion.name, icon: emotion.icon, description: emotion.description })}
                        className="w-full bg-primary hover:bg-primary/90"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Añadir
                    </Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
