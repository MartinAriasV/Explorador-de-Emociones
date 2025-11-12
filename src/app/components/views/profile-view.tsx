"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { UserProfile, ShopItem } from '@/lib/types';
import { AVATAR_EMOJIS, SHOP_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Check, Save } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProfileViewProps {
  userProfile: UserProfile | null;
  setUserProfile: (profile: Partial<Omit<UserProfile, 'id'>>) => void;
  purchasedItems: ShopItem[];
}

export function ProfileView({ userProfile, setUserProfile, purchasedItems }: ProfileViewProps) {
  const { toast } = useToast();
  
  const [localName, setLocalName] = useState(userProfile?.name || '');
  const [localAvatar, setLocalAvatar] = useState(userProfile?.avatar || '😊');
  const [localAvatarType, setLocalAvatarType] = useState(userProfile?.avatarType || 'emoji');
  
  const [activeFrameId, setActiveFrameId] = useState(userProfile?.activeAvatarFrameId || null);
  const [activeBackgroundId, setActiveBackgroundId] = useState(userProfile?.activeRoomBackgroundId || null);
  const [activeThemeId, setActiveThemeId] = useState(userProfile?.activeAppThemeId || 'theme_original');

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setLocalName(userProfile.name);
      setLocalAvatar(userProfile.avatar);
      setLocalAvatarType(userProfile.avatarType);
      setActiveFrameId(userProfile.activeAvatarFrameId || null);
      setActiveBackgroundId(userProfile.activeRoomBackgroundId || null);
      setActiveThemeId(userProfile.activeAppThemeId || 'theme_original');
    }
  }, [userProfile]);

  const handleSave = () => {
    if (!localName || !localAvatar) {
      toast({ title: "Faltan campos", description: "Asegúrate de tener un nombre y un avatar.", variant: "destructive"});
      return;
    }
    
    setUserProfile({ 
      name: localName, 
      avatar: localAvatar, 
      avatarType: localAvatarType,
      activeAvatarFrameId: activeFrameId,
      activeRoomBackgroundId: activeBackgroundId,
      activeAppThemeId: activeThemeId
    });
    
    setSaved(true);
    toast({ title: "¡Perfil Guardado!" });
    setTimeout(() => setSaved(false), 2000);
  };
  
  const selectAvatar = (avatar: string, type: 'emoji' | 'generated') => {
    setLocalAvatar(avatar);
    setLocalAvatarType(type);
  };
  
  const purchasedFrames: (ShopItem | {id: string, name: string, iconUrl: string})[] = [
    { id: 'frame_none', name: 'Ninguno', iconUrl: 'https://openmoji.org/data/color/svg/274C.svg' },
    ...((purchasedItems || []).filter(item => item.type === 'avatar_frame'))
  ];
  
  const purchasedBackgrounds: (ShopItem | {id: string, name: string, iconUrl: string})[] = [
    { id: 'bg_default', name: 'Por Defecto', iconUrl: 'https://openmoji.org/data/color/svg/1F3E0.svg' },
    ...((purchasedItems || []).filter(item => item.type === 'room_background'))
  ];

  const purchasedThemes: (ShopItem | {id: string, name: string, iconUrl: string})[] = [
    { id: 'theme_original', name: 'Original', iconUrl: 'https://openmoji.org/data/color/svg/1F3A8.svg' },
    ...((purchasedItems || []).filter(item => item.type === 'theme'))
  ];

  const selectedFrameItem = SHOP_ITEMS.find(item => item.id === activeFrameId);
  const frameClass = selectedFrameItem ? cn('rounded-full border-8', selectedFrameItem.value) : 'border-4 border-transparent';

  if (!userProfile) return <p>Cargando perfil...</p>;

  return (
    <div className="flex flex-col h-full gap-6 p-4 md:p-6">
      <CardHeader className="p-0 flex-shrink-0">
        <CardTitle className="text-3xl font-bold text-primary">Mi Perfil</CardTitle>
        <CardDescription>Personaliza tu apariencia y equipa los artículos que has comprado en la tienda.</CardDescription>
      </CardHeader>
      
      <div className="flex flex-col md:flex-row gap-6 flex-grow min-h-0">
        <div className="md:w-1/3 flex flex-col gap-6">
          <Card className="flex flex-col items-center justify-center p-6 text-center shadow-lg">
              <div className={cn("relative transition-all", frameClass)}>
                  <Avatar className="h-40 w-40 text-7xl">
                      {localAvatarType === 'generated' ? (
                          <AvatarImage src={localAvatar} alt={localName} />
                      ) : (
                          <AvatarFallback className="bg-primary/10">{localAvatar}</AvatarFallback>
                      )}
                  </Avatar>
              </div>
              <Input
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                placeholder="Tu Nombre"
                className="text-2xl font-bold text-center border-none focus-visible:ring-0 focus-visible:ring-offset-0 mt-6 bg-transparent"
              />
          </Card>
          <Button onClick={handleSave} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6 font-bold flex-shrink-0">
            {saved ? <Check className="mr-2 h-5 w-5" /> : <Save className="mr-2 h-5 w-5" />}
            {saved ? '¡Guardado!' : 'Guardar Cambios'}
          </Button>
        </div>

        <Card className="md:w-2/3 shadow-lg flex flex-col flex-grow min-h-0">
          <Tabs defaultValue="avatar" className="w-full flex flex-col flex-grow h-full p-4">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 flex-shrink-0">
              <TabsTrigger value="avatar">Avatar</TabsTrigger>
              <TabsTrigger value="frames">Marcos</TabsTrigger>
              <TabsTrigger value="backgrounds">Fondos</TabsTrigger>
              <TabsTrigger value="themes">Temas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="avatar" className="flex-grow pt-4 min-h-0">
                <ScrollArea className="h-full">
                  <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 lg:grid-cols-7 gap-2">
                    {(AVATAR_EMOJIS || []).map((emoji, index) => (
                      <button
                        type="button"
                        key={`emoji-${index}`}
                        onClick={() => selectAvatar(emoji, 'emoji')}
                        className={cn(
                          'text-4xl p-2 rounded-lg transition-all flex items-center justify-center aspect-square',
                          localAvatar === emoji && localAvatarType === 'emoji' ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-primary/10'
                        )}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
            </TabsContent>

            <TabsContent value="frames" className="flex-grow pt-4 min-h-0">
                <ScrollArea className="h-full">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {purchasedFrames.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveFrameId(item.id === 'frame_none' ? null : item.id)}
                        className={cn(
                          'flex flex-col gap-2 rounded-lg border-2 p-2 items-center justify-center transition-all aspect-square relative',
                          (!activeFrameId && item.id === 'frame_none') || activeFrameId === item.id 
                            ? 'ring-4 ring-primary/30 border-primary bg-primary/10' 
                            : 'hover:bg-muted/50 bg-card'
                        )}
                      >
                        <img src={item.iconUrl} alt={item.name} className="w-12 h-12" />
                        <span className="text-xs font-semibold truncate text-center">{item.name}</span>
                        {((!activeFrameId && item.id === 'frame_none') || activeFrameId === item.id) && (
                          <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
            </TabsContent>
            
            <TabsContent value="backgrounds" className="flex-grow pt-4 min-h-0">
                <ScrollArea className="h-full">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {purchasedBackgrounds.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveBackgroundId(item.id === 'bg_default' ? null : item.id)}
                        className={cn(
                          'flex flex-col gap-2 rounded-lg border-2 p-2 items-center justify-center transition-all aspect-square relative',
                          (!activeBackgroundId && item.id === 'bg_default') || activeBackgroundId === item.id 
                            ? 'ring-4 ring-primary/30 border-primary bg-primary/10' 
                            : 'hover:bg-muted/50 bg-card'
                        )}
                      >
                        <img src={item.iconUrl} alt={item.name} className="w-12 h-12" />
                        <span className="text-xs font-semibold truncate text-center">{item.name}</span>
                        {((!activeBackgroundId && item.id === 'bg_default') || activeBackgroundId === item.id) && (
                          <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
            </TabsContent>

            <TabsContent value="themes" className="flex-grow pt-4 min-h-0">
                <ScrollArea className="h-full">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {purchasedThemes.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveThemeId(item.id)}
                        className={cn(
                          'flex flex-col gap-2 rounded-lg border-2 p-2 items-center justify-center transition-all aspect-square relative',
                          activeThemeId === item.id 
                            ? 'ring-4 ring-primary/30 border-primary bg-primary/10' 
                            : 'hover:bg-muted/50 bg-card'
                        )}
                      >
                        <img src={item.iconUrl} alt={item.name} className="w-12 h-12" />
                        <span className="text-xs font-semibold truncate text-center">{item.name}</span>
                        {activeThemeId === item.id && (
                          <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
