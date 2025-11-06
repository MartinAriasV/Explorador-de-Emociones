"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SPIRIT_ANIMALS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { SpiritAnimal } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';


interface SanctuaryViewProps {
  unlockedAnimalIds: string[];
}

const rarityStyles = {
  'Común': 'border-gray-300 dark:border-gray-600',
  'Poco Común': 'border-green-400 dark:border-green-700',
  'Raro': 'border-blue-400 dark:border-blue-700',
  'Épico': 'border-purple-500 dark:border-purple-600',
  'Legendario': 'border-amber-400 dark:border-amber-500 shadow-amber-400/20',
};

const rarityTextStyles = {
    'Común': 'text-gray-500 dark:text-gray-400',
    'Poco Común': 'text-green-600 dark:text-green-400',
    'Raro': 'text-blue-600 dark:text-blue-500',
    'Épico': 'text-purple-600 dark:text-purple-500',
    'Legendario': 'text-amber-500 dark:text-amber-400',
}

function AnimalCard({ animal, isUnlocked }: { animal: SpiritAnimal; isUnlocked: boolean }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card 
          className={cn(
              "flex flex-col items-center justify-center p-6 aspect-square transition-all duration-300 border-4 cursor-pointer",
              isUnlocked ? cn('shadow-lg hover:shadow-2xl hover:scale-105', rarityStyles[animal.rarity]) : 'bg-muted/50 border-dashed'
          )}
        >
          <div className="flex-grow flex flex-col items-center justify-center text-center gap-2">
            {isUnlocked ? (
              <>
                <span className="text-7xl drop-shadow-lg">{animal.icon}</span>
                <h3 className="text-xl font-bold text-foreground">{animal.name}</h3>
              </>
            ) : (
              <>
                <span className="text-7xl grayscale opacity-40">❓</span>
                <h3 className="text-xl font-bold text-muted-foreground">Bloqueado</h3>
              </>
            )}
          </div>
          <p className={cn(
            "font-semibold text-sm",
            isUnlocked ? rarityTextStyles[animal.rarity] : 'text-muted-foreground'
          )}>
            {animal.rarity}
          </p>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">{isUnlocked ? animal.name : 'Animal Bloqueado'}</DialogTitle>
          <DialogDescription className="pt-2">
            {isUnlocked ? (
                <div className="space-y-1">
                    <span className="block font-bold text-lg" style={{ color: `hsl(var(--primary))` }}>{animal.emotion}</span>
                    <span className="block text-sm text-muted-foreground mt-1">{animal.description}</span>
                </div>
            ) : (
                <div className="space-y-1">
                    <span className="block font-bold text-lg" style={{ color: `hsl(var(--primary))` }}>¿Cómo desbloquear?</span>
                    <span className="block text-sm text-muted-foreground mt-1">{animal.unlockHint}</span>
                </div>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}


export function SanctuaryView({ unlockedAnimalIds }: SanctuaryViewProps) {
  return (
    <Card className="w-full h-full shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary">Mi Santuario</CardTitle>
        <CardDescription>Tu colección de animales espirituales desbloqueados. Cada uno representa un hito en tu viaje emocional.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4 -mr-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {SPIRIT_ANIMALS.map((animal) => {
                  const isUnlocked = unlockedAnimalIds.includes(animal.id);
                  return (
                    <AnimalCard key={animal.id} animal={animal} isUnlocked={isUnlocked} />
                  );
                })}
              </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
