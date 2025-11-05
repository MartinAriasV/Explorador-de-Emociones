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
  setUserProfile: (profile: Omit<UserProfile, 'id'>) => void;
}

const defaultProfile: Omit<UserProfile, 'id'> = {
  name: 'Usuario',
  avatar: '😊',
  avatarType: 'emoji',
};

export function ProfileView({ userProfile, setUserProfile }: ProfileViewProps) {
  // Use local state to manage form fields, initialized from userProfile or defaults
  const [localName, setLocalName] = useState(userProfile?.name || defaultProfile.name);
  const [localAvatar, setLocalAvatar] = useState(userProfile?.avatar || defaultProfile.avatar);
  const [localAvatarType, setLocalAvatarType] = useState(userProfile?.avatarType || defaultProfile.avatarType);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  // Effect to sync local state if the userProfile prop changes from Firestore
  useEffect(() => {
    if (userProfile) {
      setLocalName(userProfile.name);
      setLocalAvatar(userProfile.avatar);
      setLocalAvatarType(userProfile.avatarType);
    } else {
      // If profile is null (new user), reset to defaults
      setLocalName(defaultProfile.name);
      setLocalAvatar(defaultProfile.avatar);
      setLocalAvatarType(defaultProfile.avatarType);
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
    // This function now handles both CREATING and UPDATING the document in Firestore
    setUserProfile({ name: localName, avatar: localAvatar, avatarType: localAvatarType });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  
  const selectAvatar = (avatar: string, type: 'emoji' | 'generated') => {
    setLocalAvatar(avatar);
    setLocalAvatarType(type);
  };

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
                <div className="grid grid-cols-8 gap-2 p-2">
                    {AVATAR_EMOJIS.map((emoji, index) => (
                        <button
                            type="button"
                            key={`${emoji}-${index}`}
                            onClick={() => selectAvatar(emoji, 'emoji')}
                            className={cn(
                                'text-3xl p-1 rounded-lg transition-all',
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
      
        <Button onClick={handleSave} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mt-auto">
          {saved ? <Check className="mr-2 h-4 w-4" /> : null}
          {saved ? '¡Guardado!' : 'Guardar Cambios'}
        </Button>
      </CardContent>
    </Card>
  );
}
