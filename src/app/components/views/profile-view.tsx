//
// 📍 ARCHIVO: src/app/components/views/profile-view.tsx
// (Reemplaza el contenido completo de este archivo)
//
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { UserProfile, ShopItem } from '@/lib/types';
import { AVATAR_EMOJIS, SHOP_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import Image from 'next/image';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

interface ProfileViewProps {
  userProfile: UserProfile | null;
  setUserProfile: (profile: Partial<Omit<UserProfile, 'id'>>) => void;
  // shopItems se importará de constants
}

export function ProfileView({ userProfile, setUserProfile }: ProfileViewProps) {
  const { toast } = useToast();
  
  // Estados locales para rastrear selecciones
  const [localName, setLocalName] = useState(userProfile?.name || '');
  const [localAvatar, setLocalAvatar] = useState(userProfile?.avatar || '😊');
  const [localAvatarType, setLocalAvatarType] = useState(userProfile?.avatarType || 'emoji');
  
  // ¡ESTOS ERAN LOS QUE FALTABAN!
  const [selectedAvatarFrameId, setSelectedAvatarFrameId] = useState(userProfile?.activeAvatarFrameId || null);
  const [selectedRoomBackgroundId, setSelectedRoomBackgroundId] = useState(userProfile?.activeRoomBackgroundId || null);
  const [selectedAppThemeId, setSelectedAppThemeId] = useState(userProfile?.activeAppThemeId || 'theme_original');

  const [saved, setSaved] = useState(false);

  // Sincronizar si el perfil de Firestore cambia
  useEffect(() => {
    if (userProfile) {
      setLocalName(userProfile.name);
      setLocalAvatar(userProfile.avatar);
      setLocalAvatarType(userProfile.avatarType);
      setSelectedAvatarFrameId(userProfile.activeAvatarFrameId || null);
      setSelectedRoomBackgroundId(userProfile.activeRoomBackgroundId || null);
      setSelectedAppThemeId(userProfile.activeAppThemeId || 'theme_original');
    }
  }, [userProfile]);

  // --- Lógica de Guardado (¡ARREGLADA!) ---
  const handleSave = () => {
    if (!localName || !localAvatar) {
      toast({ title: "Faltan campos", description: "Asegúrate de tener un nombre y un avatar.", variant: "destructive"});
      return;
    }
    
    // Guardar TODO en Firestore
    setUserProfile({ 
      name: localName, 
      avatar: localAvatar, 
      avatarType: localAvatarType,
      activeRoomBackgroundId: selectedRoomBackgroundId, // <-- ¡Guardado Correctamente!
      activeAvatarFrameId: selectedAvatarFrameId, // <-- ¡Guardado Correctamente!
      activeAppThemeId: selectedAppThemeId // <-- ¡Guardado Correctamente!
    });
    
    setSaved(true);
    toast({ title: "¡Perfil Guardado!" });
    setTimeout(() => setSaved(false), 2000);
  };
  
  const selectAvatar = (avatar: string, type: 'emoji' | 'generated') => {
    setLocalAvatar(avatar);
    setLocalAvatarType(type);
  };

  // --- Filtrar ítems comprados ---
  const purchasedItemIds = new Set(userProfile?.purchasedItemIds || []);
  
  const avatarFrames: (ShopItem | {id: string, name: string, iconUrl: string, type: string})[] = [
    { id: 'frame_none', name: 'Ninguno', iconUrl: 'https://openmoji.org/data/color/svg/274C.svg', type: 'avatar_frame' }, // 'X' emoji
    ...SHOP_ITEMS.filter(item => item.type === 'avatar_frame' && purchasedItemIds.has(item.id))
  ];
  
  const roomBackgrounds: (ShopItem | {id: string, name: string, iconUrl: string, type: string})[] = [
    { id: 'bg_default', name: 'Por Defecto', iconUrl: 'https://openmoji.org/data/color/svg/1F3E0.svg', type: 'room_background' }, // Casa emoji
    ...SHOP_ITEMS.filter(item => item.type === 'room_background' && purchasedItemIds.has(item.id))
  ];

  const appThemes: (ShopItem | {id: string, name: string, iconUrl: string, type: string})[] = [
    { id: 'theme_original', name: 'Original', iconUrl: 'https://openmoji.org/data/color/svg/1F3A8.svg', type: 'theme' }, // Paleta emoji
    ...SHOP_ITEMS.filter(item => item.type === 'theme' && purchasedItemIds.has(item.id))
  ];


  if (!userProfile) {
    return <p>Cargando perfil...</p>; // Estado de carga simple
  }

  return (
    <Card className="w-full max-w-2xl mx-auto h-full shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Mi Perfil</CardTitle>
        <CardDescription>Personaliza tu apariencia y equipa los artículos que has comprado en la tienda.</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col gap-6 overflow-y-auto p-4 md:p-6">
        
        {/* --- Sección de Nombre --- */}
        <div className="space-y-2">
          <Label className="text-lg font-semibold">Tu Nombre</Label>
          <Input
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            placeholder="Usuario"
            className="text-base"
          />
        </div>

        {/* --- Sección de Avatar (Emoji) --- */}
        <div className="flex-grow flex flex-col min-h-0 space-y-2">
          <Label className="text-lg font-semibold">Elige tu Avatar</Label>
          <ScrollArea className="flex-grow rounded-lg border p-2 bg-muted/30">
            <div className="grid grid-cols-8 gap-2">
              {AVATAR_EMOJIS.map((emoji, index) => (
                <button
                  type="button"
                  key={`emoji-${index}`}
                  onClick={() => selectAvatar(emoji, 'emoji')}
                  className={cn(
                    'text-3xl p-1 rounded-lg transition-all flex items-center justify-center aspect-square',
                    localAvatar === emoji && localAvatarType === 'emoji' ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-primary/10'
                  )}
                >
                  {emoji}
                </button>
              ))}
              {userProfile.avatarType === 'generated' && (
                <button
                  type="button"
                  onClick={() => selectAvatar(userProfile.avatar, 'generated')}
                  className={cn(
                    'relative rounded-lg overflow-hidden transition-all flex items-center justify-center aspect-square',
                    localAvatar === userProfile.avatar && localAvatarType === 'generated' ? 'ring-2 ring-primary' : 'hover:opacity-80'
                  )}
                >
                  <Image src={userProfile.avatar} alt="Avatar Generado" layout="fill" objectFit="cover" />
                </button>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* --- Sección Marcos de Avatar --- */}
        <div className="space-y-2">
          <Label className="text-lg font-semibold">Marcos de Avatar Comprados</Label>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-2 p-2">
              {avatarFrames.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedAvatarFrameId(item.id === 'frame_none' ? null : item.id)}
                  className={cn(
                    'h-20 w-20 flex-col gap-1 rounded-lg border-2 flex items-center justify-center transition-all shrink-0',
                    (!selectedAvatarFrameId && item.id === 'frame_none') || selectedAvatarFrameId === item.id 
                      ? 'ring-4 ring-primary/30 border-primary bg-primary/10' 
                      : 'hover:bg-muted/50 bg-card'
                  )}
                >
                  <img src={item.iconUrl} alt={item.name} className="w-10 h-10" />
                  <span className="text-xs font-semibold truncate">{item.name}</span>
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* --- Sección Fondos de Habitación --- */}
        <div className="space-y-2">
          <Label className="text-lg font-semibold">Fondos para la Habitación</Label>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-2 p-2">
              {roomBackgrounds.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedRoomBackgroundId(item.id === 'bg_default' ? null : item.id)}
                  className={cn(
                    'h-20 w-20 flex-col gap-1 rounded-lg border-2 flex items-center justify-center transition-all shrink-0',
                    (!selectedRoomBackgroundId && item.id === 'bg_default') || selectedRoomBackgroundId === item.id 
                      ? 'ring-4 ring-primary/30 border-primary bg-primary/10' 
                      : 'hover:bg-muted/50 bg-card'
                  )}
                >
                  <img src={item.iconUrl} alt={item.name} className="w-10 h-10" />
                  <span className="text-xs font-semibold truncate">{item.name}</span>
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        
        {/* --- Sección Temas de la App --- */}
        <div className="space-y-2">
          <Label className="text-lg font-semibold">Temas de la Aplicación</Label>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-2 p-2">
              {appThemes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedAppThemeId(item.id)}
                  className={cn(
                    'h-20 w-20 flex-col gap-1 rounded-lg border-2 flex items-center justify-center transition-all shrink-0',
                    selectedAppThemeId === item.id 
                      ? 'ring-4 ring-primary/30 border-primary bg-primary/10' 
                      : 'hover:bg-muted/50 bg-card'
                  )}
                >
                  <img src={item.iconUrl} alt={item.name} className="w-10 h-10" />
                  <span className="text-xs font-semibold truncate">{item.name}</span>
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        
        {/* --- Botón de Guardar --- */}
        <Button onClick={handleSave} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mt-auto text-base py-6 font-bold">
          {saved ? <Check className="mr-2 h-4 w-4" /> : null}
          {saved ? '¡Guardado!' : 'Guardar Cambios'}
        </Button>
      </CardContent>
    </Card>
  );
}
