"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Emotion } from '@/lib/types';
import { Sparkles, Loader } from 'lucide-react';
import { defineEmotionMeaning } from '@/ai/flows/define-emotion-meaning';
import { useToast } from '@/hooks/use-toast';
import { AVATAR_EMOJIS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface EmocionarioViewProps {
  emotionsList: Emotion[];
  addEmotion: (emotion: Omit<Emotion, 'id'>) => void;
}

export function EmocionarioView({ emotionsList, addEmotion }: EmocionarioViewProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [color, setColor] = useState('#47a2a2');
  const [description, setDescription] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateDescription = async () => {
    if (!name) {
      toast({ title: "Falta el nombre", description: "Por favor, introduce un nombre para la emoción.", variant: "destructive" });
      return;
    }
    setIsAiLoading(true);
    try {
      const result = await defineEmotionMeaning({ emotion: name });
      setDescription(`${result.definition} Ejemplo: ${result.example}`);
    } catch (error) {
      console.error("Error generating description:", error);
      toast({ title: "Error de IA", description: "No se pudo generar una descripción.", variant: "destructive" });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !icon || !color) return;
    addEmotion({ name, icon, color, description });
    setName('');
    setIcon('');
    setColor('#47a2a2');
    setDescription('');
  };

  return (
    <Card className="w-full h-full shadow-lg overflow-hidden">
      <div className="grid lg:grid-cols-2 h-full">
        <div className="p-6 flex flex-col border-b lg:border-r lg:border-b-0">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-2xl font-bold text-primary">Añadir Emoción</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              placeholder="Nombre de la Emoción (ej. Euforia)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
            <div className="flex items-center gap-2">
              <label htmlFor="emotion-color" className="text-sm font-medium">Color:</label>
              <Input
                id="emotion-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-16 h-10 p-1"
              />
            </div>
            <div className="relative">
              <Textarea
                placeholder="¿Qué significa esta emoción para ti?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-primary hover:bg-primary/10"
                onClick={handleGenerateDescription}
                disabled={isAiLoading}
              >
                {isAiLoading ? <Loader className="animate-spin" /> : <Sparkles />}
              </Button>
            </div>
            <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full">
              Añadir Emoción
            </Button>
          </form>
        </div>
        <div className="p-6 flex flex-col h-full">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-2xl font-bold text-primary">Tu Emocionario</CardTitle>
          </CardHeader>
          <ScrollArea className="flex-grow max-h-[calc(100vh-250px)] lg:max-h-full">
            {emotionsList.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {emotionsList.map((em) => (
                  <Card key={em.id} className="p-4 text-center border-2" style={{ borderColor: em.color }}>
                    <p className="text-4xl mb-2">{em.icon}</p>
                    <p className="font-bold truncate" style={{ color: em.color }}>{em.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{em.description}</p>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                <p>Tu emocionario está esperando a que lo llenes.</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </Card>
  );
}
