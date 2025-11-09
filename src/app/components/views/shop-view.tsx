"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star, CheckCircle } from 'lucide-react';
import type { ShopItem, UserProfile } from '@/lib/types';
import { cn } from '@/lib/utils';

// Hardcoded shop items for now
const SHOP_ITEMS: ShopItem[] = [
    { id: 'theme-ocean', name: 'Tema Océano', description: 'Un tema azul y relajante para la aplicación.', cost: 100, type: 'theme', value: 'theme-ocean', icon: '🌊' },
    { id: 'theme-forest', name: 'Tema Bosque', description: 'Un tema verde y tranquilo inspirado en la naturaleza.', cost: 100, type: 'theme', value: 'theme-forest', icon: '🌳' },
    { id: 'frame-gold', name: 'Marco Dorado', description: 'Un marco dorado brillante para tu avatar.', cost: 250, type: 'avatar_frame', value: 'frame-gold', icon: '🖼️' },
    { id: 'frame-silver', name: 'Marco Plateado', description: 'Un marco plateado elegante para tu avatar.', cost: 150, type: 'avatar_frame', value: 'frame-silver', icon: '🖼️' },
    { id: 'hat-cowboy', name: 'Sombrero de Vaquero', description: 'Un sombrero de vaquero para tu mascota IA.', cost: 500, type: 'pet_accessory', value: 'hat-cowboy', icon: '🤠' },
    { id: 'hat-wizard', name: 'Sombrero de Mago', description: 'Un sombrero de mago místico para tu mascota.', cost: 750, type: 'pet_accessory', value: 'hat-wizard', icon: '🧙' },
];

interface ShopViewProps {
  userProfile: UserProfile;
  onPurchaseItem: (item: ShopItem) => void;
}

export function ShopView({ userProfile, onPurchaseItem }: ShopViewProps) {
  const userPoints = userProfile.points || 0;
  const purchasedIds = new Set(userProfile.purchasedItemIds || []);

  return (
    <Card className="w-full h-full shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary">Tienda de Recompensas</CardTitle>
        <CardDescription>¡Usa tus puntos para desbloquear nuevos temas, marcos y accesorios!</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4 -mr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SHOP_ITEMS.map((item) => {
              const isPurchased = purchasedIds.has(item.id);
              const canAfford = userPoints >= item.cost;
              return (
                <Card key={item.id} className={cn("flex flex-col", isPurchased && "bg-muted/50")}>
                  <CardHeader className="flex-row items-center gap-4">
                    <span className="text-4xl">{item.icon}</span>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{item.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                  <CardFooter className="flex flex-col items-stretch gap-2">
                    <div className="flex justify-center items-center gap-2 font-bold text-lg text-yellow-500">
                        <Star className="w-5 h-5"/>
                        <span>{item.cost}</span>
                    </div>
                    <Button
                      onClick={() => onPurchaseItem(item)}
                      disabled={isPurchased || !canAfford}
                    >
                      {isPurchased ? (
                        <>
                          <CheckCircle className="mr-2" /> Comprado
                        </>
                      ) : (
                        'Comprar'
                      )}
                    </Button>
                    {!isPurchased && !canAfford && (
                        <p className="text-xs text-center text-destructive">Puntos insuficientes</p>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
