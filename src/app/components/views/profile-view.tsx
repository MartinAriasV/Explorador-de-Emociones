'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
import { AVATAR_EMOJIS, SHOP_ITEMS } from '@/lib/constants';
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
  const [localActiveBg, setLocalActiveBg] = useState(userProfile?.activePetBackgroundId || null);
  
  const [hasChanges, setHasChanges] = useState(false);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userProfile) {
      setLocalName(userProfile.name);
      setLocalAvatar(userProfile.avatar);
      setLocalAvatarType(userProfile.avatarType);
      setLocalEquippedItems(userProfile.equippedItems || {});
      setLocalActiveBg(userProfile.activePetBackgroundId || null);
    }
  }, [userProfile]);

  useEffect(() => {
    if (!userProfile) return;
    const nameChanged = localName !== userProfile.name;
    const avatarChanged = localAvatar !== userProfile.avatar;
    const itemsChanged =
      JSON.stringify(localEquippedItems) !==
      JSON.stringify(userProfile.equippedItems || {});
    const bgChanged = localActiveBg !== userProfile.activePetBackgroundId;

    setHasChanges(
      nameChanged || avatarChanged || itemsChanged || bgChanged
    );
  }, [
    localName,
    localAvatar,
    localEquippedItems,
    localActiveBg,
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
      activePetBackgroundId: localActiveBg,
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
  
  const handleEquipBackground = (item: ShopItem) => {
    setLocalActiveBg(item.id);
  }

  const handleUnequipItem = (itemType: ShopItemType) => {
    const newItems = { ...localEquippedItems };
    delete newItems[itemType];
    setLocalEquippedItems(newItems);
  };

  const purchasedFrames = useMemo(() => purchasedItems.filter(
    (item) => item.type === 'avatar_frame'
  ), [purchasedItems]);
  const purchasedThemes = useMemo(() => purchasedItems.filter(
    (item) => item.type === 'theme'
  ), [purchasedItems]);
  const purchasedBackgrounds = useMemo(() => purchasedItems.filter(
    (item) => item.type === 'pet_background'
  ), [purchasedItems]);

  if (!userProfile) {
    return (
      <Card className="w-full max-w-2xl mx-auto h-full shadow-lg flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-primary">Cargando perfil...</p>
      </Card>
    );
  }

  const equippedFrame = SHOP_ITEMS.find(item => item.id === localEquippedItems['avatar_frame']);
  const frameClass = equippedFrame ? cn('rounded-full p-1', equippedFrame.value) : '';
  const avatarClass = 'h-24 w-24 text-6xl';

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg flex flex-col">
    <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
        Mi Perfil
        </CardTitle>
        <CardDescription>
        Personaliza tu apariencia y equipa los artículos que has comprado en
        la tienda.
        </CardDescription>
    </CardHeader>
    <CardContent className="flex-grow flex flex-col gap-6">
        <ScrollArea className="h-full pr-4 -mr-4">
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className={cn('flex items-center justify-center rounded-full', frameClass)}>
                    {localAvatarType === 'emoji' ? (
                        <div className={cn('rounded-full bg-muted flex items-center justify-center', avatarClass, !equippedFrame && 'border-2 border-primary/20')}>
                        {localAvatar}
                        </div>
                    ): (
                        <Image src={localAvatar} alt="Avatar" width={96} height={96} className={cn('rounded-full', avatarClass)} />
                    )}
                </div>
                <div className="space-y-2 flex-1 w-full">
                <label className="text-sm font-medium">Tu Nombre</label>
                <Input
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    placeholder="Usuario"
                />
                </div>
            </div>

            <div className="space-y-2">
            <label className="text-sm font-medium">Elige tu Avatar</label>
            <ScrollArea className="h-40 rounded-lg border p-2">
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
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
            
            {purchasedBackgrounds.length > 0 && (
            <div className="space-y-2">
                <label className="text-sm font-medium">
                Fondos para la Habitación de tu Mascota
                </label>
                <div className="flex flex-wrap gap-4 items-center">
                <Button
                    variant="outline"
                    onClick={() => setLocalActiveBg(null)}
                    className={cn(
                    'h-16 w-16 text-muted-foreground flex flex-col gap-1 items-center justify-center',
                    !localActiveBg && 'ring-2 ring-primary'
                    )}
                >
                    <X />
                    <span className="text-xs">Por Defecto</span>
                </Button>
                {purchasedBackgrounds.map((item) => (
                    <Button
                    key={item.id}
                    variant="outline"
                    onClick={() => handleEquipBackground(item)}
                    className={cn(
                        'h-16 w-16 text-4xl flex items-center justify-center',
                        localActiveBg === item.id && 'ring-2 ring-primary'
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
        </div>
        </ScrollArea>
    </CardContent>
    <CardFooter className="pt-6">
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