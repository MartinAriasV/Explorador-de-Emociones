"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SPIRIT_ANIMALS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { SpiritAnimal, UserProfile } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, Star } from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';


interface SanctuaryViewProps {
  userProfile: UserProfile | null;
  onSelectPet: (pet: SpiritAnimal) => void;
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

function AnimalCard({ animal, isUnlocked, onSelectPet, isActivePet }: { animal: SpiritAnimal; isUnlocked: boolean, onSelectPet: (pet: SpiritAnimal) => void; isActivePet: boolean; }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card 
          className={cn(
              "flex flex-col items-center justify-center p-6 aspect-square transition-all duration-300 border-4 cursor-pointer relative",
              isUnlocked ? cn('shadow-lg hover:shadow-2xl hover:scale-105', rarityStyles[animal.rarity]) : 'bg-muted/50 border-dashed',
              isActivePet && 'ring-4 ring-offset-2 ring-accent'
          )}
        >
          {isActivePet && (
            <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 text-xs font-bold rounded-full flex items-center gap-1">
                <Star className="h-3 w-3" />
                Activo
            </div>
          )}
          <div className="flex-grow flex flex-col items-center justify-center text-center gap-2">
            {isUnlocked ? (
              <>
                <div className="relative w-24 h-24">
                  <Player src={animal.lottieUrl} autoplay loop />
                </div>
                <h3 className="text-xl font-bold text-foreground">{animal.name}</h3>
              </>
            ) : (
              <>
                <div className="relative w-24 h-24">
                  <Player src={animal.lottieUrl} loop />
                   <div className="absolute inset-0 bg-background/50 backdrop-grayscale"></div>
                </div>
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
          <DialogTitle className="text-2xl text-primary flex items-center gap-3">
             <div className="relative w-16 h-16">
                <Player src={animal.lottieUrl} autoplay loop className={cn(!isUnlocked && "grayscale opacity-60")} />
             </div>
             {isUnlocked ? animal.name : 'Animal Bloqueado'}
          </DialogTitle>
          <DialogDescription asChild>
            <div className="pt-2">
              {isUnlocked ? (
                  <div className="space-y-4">
                      <div className="font-bold text-lg" style={{ color: `hsl(var(--primary))` }}>{animal.emotion}</div>
                      <div className="text-sm text-muted-foreground mt-1">{animal.description}</div>
                      <Button onClick={() => onSelectPet(animal)} className="w-full">
                          <MessageCircle className="mr-2 h-4 w-4"/>
                          Chatear y establecer como activo
                      </Button>
                  </div>
              ) : (
                  <div className="space-y-1">
                      <div className="font-bold text-lg" style={{ color: `hsl(var(--primary))` }}>¿Cómo desbloquear?</div>
                      <div className="text-sm text-muted-foreground mt-1">{animal.unlockHint}</div>
                  </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}


export function SanctuaryView({ userProfile, onSelectPet }: SanctuaryViewProps) {
  return (
    <Card className="w-full h-full shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary">Mi Santuario</CardTitle>
        <CardDescription>Tu colección de animales espirituales. Haz clic en uno para establecerlo como tu compañero IA activo y chatear con él.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4 -mr-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {SPIRIT_ANIMALS.map((animal) => {
                  const isUnlocked = userProfile?.unlockedAnimalIds?.includes(animal.id) ?? false;
                  const isActivePet = userProfile?.activePetId === animal.id;
                  return (
                    <AnimalCard key={animal.id} animal={animal} isUnlocked={isUnlocked} onSelectPet={onSelectPet} isActivePet={isActivePet} />
                  );
                })}
              </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
