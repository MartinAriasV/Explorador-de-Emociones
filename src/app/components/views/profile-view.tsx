'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { UserProfile, ShopItem, ShopItemType } from '@/lib/types';
import { AVATAR_EMOJIS, SPIRIT_ANIMALS, SHOP_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface ProfileViewProps {
  userProfile: UserProfile | null;
  setUserProfile: (profile: Partial<Omit<UserProfile, 'id'>>) => void;
  purchasedItems: ShopItem[];
}

const accessoryPositions: { [key: string]: React.CSSProperties } = {
    'hat-cowboy': { top: '-10px', transform: 'translateX(-50%) rotate(-15deg)', left: '40%', fontSize: '1.5rem' },
    'hat-wizard': { top: '-15px', transform: 'translateX(-50%)', left: '50%', fontSize: '1.75rem' },
    'glasses-sun': { top: '3px', left: '50%', transform: 'translateX(-50%)', fontSize: '1.5rem' },
    'scarf-gryffindor': { bottom: '-2px', left: '50%', transform: 'translateX(-50%)', fontSize: '1.5rem' },
};

export function ProfileView({
  userProfile,
  setUserProfile,
  purchasedItems,
}: ProfileViewProps) {
  const [localName, setLocalName] = useState(userProfile?.name || '');
  const [localAvatar, setLocalAvatar] = useState(userProfile?.avatar || '');
  const [localAvatarType, setLocalAvatarType] = useState(
    userProfile?.avatarType || 'emoji'
  );
  const [localEquippedItems, setLocalEquippedItems] = useState(
    userProfile?.equippedItems || {}
  );
  const [
    localEquippedPetAccessories,
    setLocalEquippedPetAccessories,
  ] = useState(userProfile?.equippedPetAccessories || {});
  const [hasChanges, setHasChanges] = useState(false);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userProfile) {
      setLocalName(userProfile.name);
      setLocalAvatar(userProfile.avatar);
      setLocalAvatarType(userProfile.avatarType);
      setLocalEquippedItems(userProfile.equippedItems || {});
      setLocalEquippedPetAccessories(userProfile.equippedPetAccessories || {});
    }
  }, [userProfile]);

  useEffect(() => {
    if (!userProfile) return;
    const nameChanged = localName !== userProfile.name;
    const avatarChanged = localAvatar !== userProfile.avatar;
    const itemsChanged =
      JSON.stringify(localEquippedItems) !==
      JSON.stringify(userProfile.equippedItems || {});
    const petItemsChanged =
      JSON.stringify(localEquippedPetAccessories) !==
      JSON.stringify(userProfile.equippedPetAccessories || {});
    setHasChanges(
      nameChanged || avatarChanged || itemsChanged || petItemsChanged
    );
  }, [
    localName,
    localAvatar,
    localEquippedItems,
    localEquippedPetAccessories,
    userProfile,
  ]);

  const handleSave = () => {
    if (!localName || !localAvatar) {
      toast({
        title: 'Faltan campos',
        description:
          'Asegúrate de tener un nombre y un avatar seleccionados.',
        variant: 'destructive',
      });
      return;
    }
    setUserProfile({
      name: localName,
      avatar: localAvatar,
      avatarType: localAvatarType,
      equippedItems: localEquippedItems,
      equippedPetAccessories: localEquippedPetAccessories,
    });
    setSaved(true);
    setHasChanges(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const selectAvatar = (avatar: string, type: 'emoji' | 'generated') => {
    setLocalAvatar(avatar);
    setLocalAvatarType(type);
  };

  const handleEquipItem = (item: ShopItem) => {
    setLocalEquippedItems((prev) => ({
      ...prev,
      [item.type]: item.id,
    }));
  };

  const handleUnequipItem = (itemType: ShopItemType) => {
    const newItems = { ...localEquippedItems };
    delete newItems[itemType];
    setLocalEquippedItems(newItems);
  };

  const handleTogglePetAccessory = (item: ShopItem) => {
    setLocalEquippedPetAccessories((prev) => {
      const newAccessories = { ...prev };
      if (newAccessories[item.id]) {
        delete newAccessories[item.id];
      } else {
        // Ensure only one accessory of each category (e.g., 'head') is equipped at a time
        const category = item.value.split('-')[0]; // e.g., 'hat', 'glasses'
        for (const id in newAccessories) {
          const existingItem = purchasedItems.find((p) => p.id === id);
          if (existingItem && existingItem.value.startsWith(category)) {
            delete newAccessories[id];
          }
        }
        newAccessories[item.id] = item.icon;
      }
      return newAccessories;
    });
  };

  const purchasedFrames = purchasedItems.filter(
    (item) => item.type === 'avatar_frame'
  );
  const purchasedThemes = purchasedItems.filter(
    (item) => item.type === 'theme'
  );
  const purchasedPetAccessories = purchasedItems.filter(
    (item) => item.type === 'pet_accessory'
  );

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
        <CardTitle className="text-2xl font-bold text-primary">
          Mi Perfil
        </CardTitle>
        <CardDescription>
          Personaliza tu apariencia y equipa los artículos que has comprado en
          la tienda.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-6 overflow-hidden">
        <ScrollArea className="h-full pr-4 -mr-4">
          <div className="space-y-6">
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
              <ScrollArea className="h-40 rounded-lg border p-2">
                <div className="grid grid-cols-8 gap-2">
                  {AVATAR_EMOJIS.map((emoji, index) => (
                    <button
                      type="button"
                      key={`${emoji}-${index}`}
                      onClick={() => selectAvatar(emoji, 'emoji')}
                      className={cn(
                        'text-3xl p-1 rounded-lg transition-all flex items-center justify-center aspect-square',
                        localAvatar === emoji && localAvatarType === 'emoji'
                          ? 'bg-primary/20 ring-2 ring-primary'
                          : 'hover:bg-primary/10'
                      )}
                    >
                      {emoji}
                    </button>
                  ))}
                  {userProfile?.avatarType === 'generated' &&
                    userProfile?.avatar && (
                      <button
                        onClick={() =>
                          selectAvatar(userProfile.avatar, 'generated')
                        }
                        className={cn(
                          'relative aspect-square rounded-lg overflow-hidden',
                          localAvatar === userProfile.avatar &&
                            localAvatarType === 'generated'
                            ? 'ring-2 ring-primary'
                            : 'hover:opacity-80'
                        )}
                      >
                        <Image
                          src={userProfile.avatar}
                          alt="Avatar generado por IA"
                          fill
                          sizes="64px"
                        />
                      </button>
                    )}
                </div>
              </ScrollArea>
            </div>

            {purchasedFrames.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Marcos de Avatar Comprados
                </label>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button
                    variant="outline"
                    onClick={() => handleUnequipItem('avatar_frame')}
                    className={cn(
                      'h-16 w-16 text-muted-foreground flex flex-col gap-1 items-center justify-center',
                      !localEquippedItems['avatar_frame'] &&
                        'ring-2 ring-primary'
                    )}
                  >
                    <X />
                    <span className="text-xs">Ninguno</span>
                  </Button>
                  {purchasedFrames.map((item) => (
                    <Button
                      key={item.id}
                      variant="outline"
                      onClick={() => handleEquipItem(item)}
                      className={cn(
                        'h-16 w-16 text-4xl flex items-center justify-center',
                        localEquippedItems['avatar_frame'] === item.id &&
                          'ring-2 ring-primary'
                      )}
                    >
                      {item.icon}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {purchasedThemes.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Temas de la Aplicación
                </label>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button
                    variant="outline"
                    onClick={() => handleUnequipItem('theme')}
                    className={cn(
                      'h-16 w-16 text-muted-foreground flex flex-col gap-1',
                      !localEquippedItems['theme'] && 'ring-2 ring-primary'
                    )}
                  >
                    <X />
                    <span className="text-xs">Original</span>
                  </Button>
                  {purchasedThemes.map((item) => (
                    <Button
                      key={item.id}
                      variant="outline"
                      onClick={() => handleEquipItem(item)}
                      className={cn(
                        'h-16 w-16 text-4xl flex items-center justify-center',
                        localEquippedItems['theme'] === item.id &&
                          'ring-2 ring-primary'
                      )}
                    >
                      {item.icon}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {purchasedPetAccessories.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Accesorios para Mascotas
                </label>
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <span className="text-7xl">
                      {(userProfile.activePetId &&
                        SPIRIT_ANIMALS.find(
                          (p) => p.id === userProfile.activePetId
                        )?.icon) ||
                        '🐶'}
                    </span>
                    {Object.entries(localEquippedPetAccessories).map(
                      ([key, icon]) => {
                        const item = SHOP_ITEMS.find((i) => i.id === key);
                        if (!item) return null;
                        return (
                          <span
                            key={key}
                            className="absolute"
                            style={{ ...accessoryPositions[item.value] }}
                          >
                            {icon}
                          </span>
                        );
                      }
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 flex-1">
                    {purchasedPetAccessories.map((item) => (
                      <Button
                        key={item.id}
                        variant="outline"
                        onClick={() => handleTogglePetAccessory(item)}
                        className={cn(
                          'h-14 w-14 text-3xl',
                          localEquippedPetAccessories[item.id] &&
                            'ring-2 ring-primary'
                        )}
                      >
                        {item.icon}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSave}
          disabled={!hasChanges}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mt-auto"
        >
          {saved ? <Check className="mr-2 h-4 w-4" /> : null}
          {saved ? '¡Guardado!' : 'Guardar Cambios'}
        </Button>
      </CardFooter>
    </Card>
  );
}
