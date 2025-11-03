"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { UserProfile } from '@/lib/types';
import { AVATAR_EMOJIS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface ProfileViewProps {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
}

export function ProfileView({ userProfile, setUserProfile }: ProfileViewProps) {
  const [localName, setLocalName] = useState(userProfile?.name || '');
  const [localAvatar, setLocalAvatar] = useState(userProfile?.avatar || '');
  const [localAvatarType, setLocalAvatarType] = useState(userProfile?.avatarType || 'emoji');
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userProfile) {
      setLocalName(userProfile.name);
      setLocalAvatar(userProfile.avatar);
      setLocalAvatarType(userProfile.avatarType);
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
    setUserProfile({ name: localName, avatar: localAvatar, avatarType: localAvatarType });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const selectAvatar = (avatar: string, type: 'emoji' | 'generated') => {
    setLocalAvatar(avatar);
    setLocalAvatarType(type);
  };

  if (!userProfile) {
    return (
      <Card className="w-full max-w-2xl mx-auto h-full shadow-lg flex flex-col items-center justify-center">
        <CardHeader>
          <CardTitle>Cargando perfil...</CardTitle>
        </CardHeader>
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

        <div className="flex-grow flex flex-col min-h-0 space-y-2">
            <label className="text-sm font-medium">Elige tu Avatar</label>
            <ScrollArea className="flex-grow rounded-lg border">
                <div className="grid grid-cols-8 gap-2 bg-muted/50 p-2">
                    {AVATAR_EMOJIS.map(emoji => (
                        <button
                            key={emoji}
                            onClick={() => selectAvatar(emoji, 'emoji')}
                            className={cn(
                                'text-3xl p-1 rounded-lg transition-all',
                                localAvatar === emoji && localAvatarType === 'emoji' ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-primary/10'
                            )}
                        >
                            {emoji}
                        </button>
                    ))}
                    {userProfile.avatarType === 'generated' && userProfile.avatar && (
                        <button onClick={() => selectAvatar(userProfile.avatar, 'generated')} className={cn('relative aspect-square rounded-lg overflow-hidden', localAvatar === userProfile.avatar && localAvatarType === 'generated' ? 'ring-2 ring-primary' : 'hover:opacity-80')}>
                            <Image src={userProfile.avatar} alt="Avatar generado por IA" fill sizes="64px"/>
                        </button>
                    )}
                </div>
            </ScrollArea>
        </div>
      
        <Button onClick={handleSave} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mt-auto">
          {saved ? <Check className="mr-2 h-4 w-4" /> : null}
          {saved ? '¡Guardado!' : 'Guardar Cambios'}
        </Button>
      </CardContent>
    </Card>
  );
}
