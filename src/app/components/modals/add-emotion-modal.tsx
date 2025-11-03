"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Emotion, PredefinedEmotion } from '@/lib/types';

interface AddEmotionModalProps {
  initialData: (Omit<PredefinedEmotion, 'example'>) | null;
  onSave: (emotionData: Omit<Emotion, 'id'>) => void;
  onClose: () => void;
}

export function AddEmotionModal({ initialData, onSave, onClose }: AddEmotionModalProps) {
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#47a2a2');

  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description);
      setColor('#47a2a2');
    }
  }, [initialData]);

  const handleSave = () => {
    if (!initialData) return;
    onSave({
      name: initialData.name,
      icon: initialData.icon,
      description,
      color,
    });
  };

  if (!initialData) return null;

  return (
    <Dialog open={!!initialData} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <span className="text-3xl">{initialData.icon}</span>
            Añadir "{initialData.name}"
          </DialogTitle>
          <DialogDescription>
            Personaliza esta emoción antes de añadirla a tu emocionario.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
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
            Guardar en mi Emocionario
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
