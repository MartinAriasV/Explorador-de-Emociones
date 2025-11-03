"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Emotion, PredefinedEmotion } from '@/lib/types';
import { AVATAR_EMOJIS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface AddEmotionModalProps {
  initialData: (Omit<PredefinedEmotion, 'example'> & { id?: string; color?: string, icon?: string }) | null;
  onSave: (emotionData: Omit<Emotion, 'id'> & { id?: string }) => void;
  onClose: () => void;
}

export function AddEmotionModal({ initialData, onSave, onClose }: AddEmotionModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#47a2a2');
  const [icon, setIcon] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setColor(initialData.color || '#47a2a2');
      setIcon(initialData.icon || '');
    }
  }, [initialData]);

  const handleSave = () => {
    if (!initialData) return;
    onSave({
      id: initialData.id,
      name,
      icon,
      description,
      color,
    });
  };

  if (!initialData) return null;

  const isEditing = !!initialData.id;

  return (
    <Dialog open={!!initialData} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <span className="text-3xl">{icon || initialData.icon}</span>
            {isEditing ? `Editar "${name}"` : `Añadir "${name}"`}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Modifica los detalles de tu emoción.' : 'Personaliza esta emoción antes de añadirla a tu emocionario.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {isEditing && (
             <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre de la emoción"
              />
          )}
           <div>
                <label className="text-sm font-medium">Icono (emoji)</label>
                <div className="grid grid-cols-8 gap-2 mt-2 bg-muted/50 p-2 rounded-lg">
                  {AVATAR_EMOJIS.map(emoji => (
                      <button
                          type="button"
                          key={emoji}
                          onClick={() => setIcon(emoji)}
                          className={cn(
                              'text-3xl p-1 rounded-lg transition-all',
                              icon === emoji ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-primary/10'
                          )}
                      >
                          {emoji}
                      </button>
                  ))}
                </div>
              </div>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="¿Qué significa esta emoción para ti?"
            rows={4}
          />
          <div className="flex items-center gap-2">
            <label htmlFor="emotion-color-modal" className="text-sm font-medium">Elige un color:</label>
            <Input
              id="emotion-color-modal"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-16 h-10 p-1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {isEditing ? 'Guardar Cambios' : 'Guardar en mi Emocionario'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
