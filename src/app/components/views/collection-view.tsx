
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SpiritAnimal, UserProfile, View } from '@/lib/types';
import { SPIRIT_ANIMALS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageCircle, Lock, Star } from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';

interface CollectionViewProps {
  userProfile: UserProfile;
  onSelectPet: (pet: SpiritAnimal) => void;
  setView: (view: View) => void;
}

const rarityTextStyles: { [key: string]: string } = {
  'Común': 'text-gray-500 dark:text-gray-400',
  'Poco Común': 'text-green-600 dark:text-green-400',
  'Raro': 'text-blue-600 dark:text-blue-500',
  'Épico': 'text-purple-600 dark:text-purple-500',
  'Legendario': 'text-amber-500 dark:text-amber-400',
};
const rarityBorderStyles: { [key: string]: string } = {
  'Común': 'border-gray-300 dark:border-gray-700',
  'Poco Común': 'border-green-500',
  'Raro': 'border-blue-500',
  'Épico': 'border-purple-500',
  'Legendario': 'border-amber-400',
};

function AnimalCard({ animal, isUnlocked, isActive, onSelectPet }: { animal: SpiritAnimal; isUnlocked: boolean, isActive: boolean, onSelectPet: (pet: SpiritAnimal) => void; }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          className={cn(
            "flex flex-col items-center justify-center p-6 aspect-square transition-all duration-300 border-4 cursor-pointer relative",
            isUnlocked 
              ? cn('shadow-lg hover:shadow-2xl hover:scale-105', rarityBorderStyles[animal.rarity]) 
              : 'bg-muted/50 border-dashed border-muted-foreground/30',
            isActive && 'ring-4 ring-primary ring-offset-2'
          )}
        >
           {isActive && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 text-xs font-bold rounded-full flex items-center gap-1 z-10">
                <Star className="h-3 w-3" />
                Activo
            </div>
          )}
          <div className="flex-grow flex flex-col items-center justify-center text-center gap-2">
            {isUnlocked ? (
              <>
                <Player
                    src={animal.lottieUrl}
                    autoplay
                    loop
                    style={{ width: '100px', height: '100px' }}
                />
                <h3 className="text-xl font-bold text-foreground">{animal.name}</h3>
              </>
            ) : (
              <>
                <Lock className="w-16 h-16 text-muted-foreground/50"/>
                <h3 className="text-xl font-bold text-muted-foreground">Bloqueado</h3>
              </>
            )}
          </div>
          <p className={cn(
            "font-semibold text-sm uppercase tracking-wider",
            isUnlocked ? rarityTextStyles[animal.rarity] : 'text-muted-foreground'
          )}>
            {animal.rarity}
          </p>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="items-center text-center">
          {isUnlocked ? (
            <Player src={animal.lottieUrl} autoplay loop style={{width: '120px', height: '120px'}} />
          ) : (
            <Lock className="w-20 h-20 text-muted-foreground/30 mb-4" />
          )}
          <DialogTitle className={cn("text-3xl font-bold", isUnlocked ? rarityTextStyles[animal.rarity] : "text-muted-foreground")}>
            {animal.name}
          </DialogTitle>
          <DialogDescription asChild>
            <div className="pt-2 space-y-4">
              <div className="space-y-1">
                <span className="block font-bold text-lg text-primary">{isUnlocked ? animal.emotion : '¿Cómo desbloquear?'}</span>
                <span className="block text-sm text-muted-foreground mt-1">{isUnlocked ? animal.description : animal.unlockHint}</span>
              </div>
              {isUnlocked && (
                  <Button onClick={() => onSelectPet(animal)} className="w-full text-lg py-6" disabled={isActive}>
                    {isActive ? "¡Ya es tu compañero!" : (
                      <>
                        <MessageCircle className="mr-2 h-5 w-5"/>
                        Elegir como Compañero
                      </>
                    )}
                  </Button>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export function CollectionView({ userProfile, onSelectPet, setView }: CollectionViewProps) {
  const unlockedIds = new Set(userProfile.unlockedAnimalIds || []);
  const activePetId = userProfile.activePetId;

  return (
    <Card className="w-full h-full shadow-lg flex flex-col border-none bg-transparent">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary">Mi Colección de Mascotas</CardTitle>
        <CardDescription>
          ¡Estos son los compañeros que has desbloqueado en tu viaje! Haz clic en uno para saber más o para elegirlo como tu compañero IA activo.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4 -mr-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {SPIRIT_ANIMALS.map((animal) => {
                const isUnlocked = unlockedIds.has(animal.id);
                const isActive = activePetId === animal.id;
                return (
                  <AnimalCard 
                    key={animal.id} 
                    animal={animal} 
                    isUnlocked={isUnlocked} 
                    isActive={isActive}
                    onSelectPet={onSelectPet} 
                  />
                );
              })}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
