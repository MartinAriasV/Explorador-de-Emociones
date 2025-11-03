"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserProfile } from '@/lib/types';
import { AVATAR_EMOJIS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import Image from 'next/image';

interface ProfileViewProps {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
}

export function ProfileView({ userProfile, setUserProfile }: ProfileViewProps) {
  const [localName, setLocalName] = useState(userProfile.name);
  const [localAvatar, setLocalAvatar] = useState(userProfile.avatar);
  const [localAvatarType, setLocalAvatarType] = useState(userProfile.avatarType);
  const [saved, setSaved] = useState(false);
  const [generatedAvatar] = useState<string | null>(
    userProfile.avatarType === 'generated' ? userProfile.avatar : null
  );

  const handleSave = () => {
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
      <CardContent className="flex-grow space-y-6">
        <div>
          <label className="text-sm font-medium">Tu Nombre</label>
          <Input
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            placeholder="Usuario"
          />
        </div>

        <div>
            <label className="text-sm font-medium">Elige tu Avatar</label>
            <div className="grid grid-cols-6 gap-2 mt-2">
                {AVATAR_EMOJIS.map(emoji => (
                    <button
                        key={emoji}
                        onClick={() => selectAvatar(emoji, 'emoji')}
                        className={cn(
                            'text-4xl p-2 rounded-lg transition-all',
                            localAvatar === emoji && localAvatarType === 'emoji' ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-primary/10'
                        )}
                    >
                        {emoji}
                    </button>
                ))}
                 {generatedAvatar && localAvatarType === 'generated' && (
                    <button onClick={() => selectAvatar(generatedAvatar, 'generated')} className={cn('relative aspect-square rounded-lg overflow-hidden', localAvatar === generatedAvatar && localAvatarType === 'generated' ? 'ring-2 ring-primary' : 'hover:opacity-80')}>
                        <Image src={generatedAvatar} alt="Avatar generado por IA" fill sizes="64px"/>
                    </button>
                 )}
            </div>
        </div>
        
        <Button onClick={handleSave} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          {saved ? <Check className="mr-2 h-4 w-4" /> : null}
          {saved ? '¡Guardado!' : 'Guardar Cambios'}
        </Button>
      </CardContent>
    </Card>
  );
}
