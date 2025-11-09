"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { UserProfile, ShopItem, ShopItemType } from '@/lib/types';
import { AVATAR_EMOJIS, SHOP_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface ProfileViewProps {
  userProfile: UserProfile | null;
  setUserProfile: (profile: Partial<Omit<UserProfile, 'id'>>) => void;
}

export function ProfileView({ userProfile, setUserProfile }: ProfileViewProps) {
  const [localName, setLocalName] = useState(userProfile?.name || '');
  const [localAvatar, setLocalAvatar] = useState(userProfile?.avatar || '');
  const [localAvatarType, setLocalAvatarType] = useState(userProfile?.avatarType || 'emoji');
  const [localEquippedItems, setLocalEquippedItems] = useState(userProfile?.equippedItems || {});
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userProfile) {
      setLocalName(userProfile.name);
      setLocalAvatar(userProfile.avatar);
      setLocalAvatarType(userProfile.avatarType);
      setLocalEquippedItems(userProfile.equippedItems || {});
    }
  }, [userProfile]);


  const handleSave = () => {
    if (!localName || !localAvatar) {
      toast({
        title: "Faltan campos",
        description: "Asegúrate de tener un nombre y un avatar seleccionados.",
        variant: "destructive",
      });
      return;
    }
    setUserProfile({ name: localName, avatar: localAvatar, avatarType: localAvatarType, equippedItems: localEquippedItems });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  
  const selectAvatar = (avatar: string, type: 'emoji' | 'generated') => {
    setLocalAvatar(avatar);
    setLocalAvatarType(type);
  };
  
  const handleEquipItem = (item: ShopItem) => {
    setLocalEquippedItems(prev => ({
        ...prev,
        [item.type]: item.id,
    }));
  };
  
  const handleUnequipItem = (itemType: ShopItemType) => {
      const newItems = { ...localEquippedItems };
      delete newItems[itemType];
      setLocalEquippedItems(newItems);
  }

  const purchasedFrames = SHOP_ITEMS.filter(item => item.type === 'avatar_frame' && userProfile?.purchasedItemIds?.includes(item.id));

  if (!userProfile) {
    return (
        <Card className="w-full max-w-2xl mx-auto h-full shadow-lg flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-primary">Cargando perfil...</p>
        </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto h-full shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Mi Perfil</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-6 overflow-hidden">
        <div className="space-y-2">
            <label className="text-sm font-medium">Tu Nombre</label>
            <Input
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            placeholder="Usuario"
            />
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium">Elige tu Avatar</label>
            <ScrollArea className="h-40 rounded-lg border">
                <div className="grid grid-cols-8 gap-2 p-2">
                    {AVATAR_EMOJIS.map((emoji, index) => (
                        <button
                            type="button"
                            key={`${emoji}-${index}`}
                            onClick={() => selectAvatar(emoji, 'emoji')}
                            className={cn(
                                'text-3xl p-1 rounded-lg transition-all flex items-center justify-center aspect-square',
                                localAvatar === emoji && localAvatarType === 'emoji' ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-primary/10'
                            )}
                        >
                            {emoji}
                        </button>
                    ))}
                    {userProfile?.avatarType === 'generated' && userProfile?.avatar && (
                        <button onClick={() => selectAvatar(userProfile.avatar, 'generated')} className={cn('relative aspect-square rounded-lg overflow-hidden', localAvatar === userProfile.avatar && localAvatarType === 'generated' ? 'ring-2 ring-primary' : 'hover:opacity-80')}>
                            <Image src={userProfile.avatar} alt="Avatar generado por IA" fill sizes="64px"/>
                        </button>
                    )}
                </div>
            </ScrollArea>
        </div>
        
        {purchasedFrames.length > 0 && (
            <div className="space-y-2">
                <label className="text-sm font-medium">Marcos de Avatar</label>
                <div className="flex gap-4 items-center">
                    <Button 
                        variant="outline"
                        onClick={() => handleUnequipItem('avatar_frame')}
                        className={cn("h-16 w-16 text-muted-foreground", !localEquippedItems['avatar_frame'] && 'ring-2 ring-primary')}
                    >
                        <X/>
                    </Button>
                    {purchasedFrames.map(item => (
                        <Button
                            key={item.id}
                            variant="outline"
                            onClick={() => handleEquipItem(item)}
                            className={cn(
                                "h-16 w-16 text-3xl",
                                localEquippedItems['avatar_frame'] === item.id && 'ring-2 ring-primary'
                            )}
                        >
                           {item.icon}
                        </Button>
                    ))}
                </div>
            </div>
        )}
      
        <Button onClick={handleSave} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mt-auto">
          {saved ? <Check className="mr-2 h-4 w-4" /> : null}
          {saved ? '¡Guardado!' : 'Guardar Cambios'}
        </Button>
      </CardContent>
    </Card>
  );
}
