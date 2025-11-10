//
// 📍 ARCHIVO: src/app/components/views/shop-view.tsx
// (Crea este nuevo archivo y pégale este código)
//
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ShopItem, UserProfile } from '@/lib/types';
import { SHOP_ITEMS } from '@/lib/constants'; // Importa la lista de ítems
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShopViewProps {
  userProfile: UserProfile;
  onPurchaseItem: (item: ShopItem) => Promise<void>;
}

export function ShopView({ userProfile, onPurchaseItem }: ShopViewProps) {
  const purchasedItemIds = new Set(userProfile.purchasedItemIds || []);
  const userPoints = userProfile.points || 0;

  // Separa los ítems por categoría
  const backgroundItems = SHOP_ITEMS.filter(item => item.type === 'room_background');
  const accessoryItems = SHOP_ITEMS.filter(item => item.type === 'pet_accessory');
  const frameItems = SHOP_ITEMS.filter(item => item.type === 'avatar_frame');
  const themeItems = SHOP_ITEMS.filter(item => item.type === 'theme');

  const renderItemGroup = (title: string, items: ShopItem[]) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-foreground">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => {
            const isPurchased = purchasedItemIds.has(item.id);
            const canAfford = userPoints >= item.cost;
            
            return (
              <Card key={item.id} className="flex flex-col shadow-lg overflow-hidden">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <img src={item.iconUrl} alt={item.name} className="w-16 h-16" />
                    <div className="flex-1">
                      <CardTitle className="text-xl text-primary">{item.name}</CardTitle>
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-lg">
                        <Star className="w-5 h-5" />
                        <span>{item.cost}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
                <div className="p-4 pt-0 mt-auto">
                  <Button 
                    onClick={() => onPurchaseItem(item)}
                    disabled={isPurchased || !canAfford}
                    className={cn("w-full font-bold py-6", isPurchased && "bg-green-600 hover:bg-green-600")}
                  >
                    {isPurchased ? "¡Comprado!" : (canAfford ? "Comprar" : "Puntos insuficientes")}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full h-full shadow-lg flex flex-col border-none bg-transparent">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary">Tienda de Recompensas</CardTitle>
        <CardDescription>
          ¡Usa los puntos que has ganado para desbloquear nuevos temas, fondos y artículos para tu mascota!
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4 -mr-4">
          <div className="space-y-8">
            {renderItemGroup("Fondos de Habitación", backgroundItems)}
            {renderItemGroup("Muebles y Juguetes", accessoryItems)}
            {renderItemGroup("Marcos de Avatar", frameItems)}
            {renderItemGroup("Temas de la App", themeItems)}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
