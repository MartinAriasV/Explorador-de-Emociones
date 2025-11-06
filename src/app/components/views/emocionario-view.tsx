"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Emotion } from '@/lib/types';
import { Sparkles, Loader, Trash2, Edit } from 'lucide-react';
import { defineEmotionMeaning } from '@/ai/flows/define-emotion-meaning';
import { useToast } from '@/hooks/use-toast';
import { AVATAR_EMOJIS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface EmocionarioViewProps {
  emotionsList: Emotion[];
  addEmotion: (emotion: Omit<Emotion, 'id' | 'userProfileId'> & { id?: string }) => void;
  onEditEmotion: (emotion: Emotion) => void;
  onDeleteEmotion: (emotionId: string) => void;
  editingEmotion: Emotion | null;
  onCancelEdit: () => void;
}

export function EmocionarioView({ emotionsList, addEmotion, onEditEmotion, onDeleteEmotion, editingEmotion, onCancelEdit }: EmocionarioViewProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [color, setColor] = useState('#8B5CF6');
  const [description, setDescription] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setName('');
    setIcon('');
    setColor('#8B5CF6');
    setDescription('');
  }

  useEffect(() => {
    if (editingEmotion) {
      setName(editingEmotion.name);
      setIcon(editingEmotion.icon);
      setColor(editingEmotion.color);
      setDescription(editingEmotion.description || '');
    } else {
      resetForm();
    }
  }, [editingEmotion]);

  const handleGenerateDescription = async () => {
    if (!name) {
      toast({ title: "Falta el nombre", description: "Por favor, introduce un nombre para la emoción.", variant: "destructive" });
      return;
    }
    setIsAiLoading(true);
    try {
      const result = await defineEmotionMeaning({ emotion: name });
      if (result.includeDetails) {
        setDescription(`${result.definition} Ejemplo: ${result.example}`);
      } else {
        setDescription(result.definition);
      }
    } catch (error) {
      console.error("Error generating description:", error);
      toast({ title: "Error de IA", description: "No se pudo generar una descripción.", variant: "destructive" });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !icon || !color) {
      toast({ title: "Faltan campos", description: "Asegúrate de que la emoción tenga un nombre y un icono.", variant: "destructive" });
      return;
    };

    const emotionData: Omit<Emotion, 'id' | 'userProfileId'> & { id?: string } = {
      name,
      icon,
      color,
      description,
    };
    
    if (editingEmotion) {
      emotionData.id = editingEmotion.id;
    }
    
    addEmotion(emotionData);

    if (editingEmotion) {
      onCancelEdit();
    } else {
      resetForm();
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6 h-full">
      <Card className="w-full shadow-lg flex flex-col transition-all duration-300 hover:shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold" style={{ color: editingEmotion ? color : 'var(--primary)' }}>
            {editingEmotion ? 'Editar Emoción' : 'Añadir Emoción'}
          </CardTitle>
          <CardDescription>{editingEmotion ? `Modificando "${editingEmotion.name}"` : 'Crea una nueva emoción para tu diario.'}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col gap-4 overflow-y-auto">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                placeholder="Nombre de la Emoción (ej. Euforia)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <div>
                <label className="text-sm font-medium">Icono (emoji)</label>
                <ScrollArea className="h-40">
                  <div className="grid grid-cols-8 gap-2 mt-2 bg-muted/50 p-2 rounded-lg">
                    {AVATAR_EMOJIS.map((emoji, index) => (
                        <button
                            type="button"
                            key={`${emoji}-${index}`}
                            onClick={() => setIcon(emoji)}
                            className={cn(
                                'text-3xl p-1 rounded-lg transition-all flex items-center justify-center aspect-square',
                                icon === emoji ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-primary/10'
                            )}
                        >
                            {emoji}
                        </button>
                    ))}
                  </div>
                </ScrollArea>
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
              <div className="flex gap-2 mt-auto">
                {editingEmotion && (
                  <Button type="button" variant="outline" onClick={onCancelEdit} className="w-full">
                    Cancelar Edición
                  </Button>
                )}
                <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full">
                  {editingEmotion ? 'Actualizar Emoción' : 'Añadir Emoción'}
                </Button>
              </div>
            </form>
        </CardContent>
      </Card>
      <Card className="w-full shadow-lg flex flex-col transition-all duration-300 hover:shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Tu Emocionario</CardTitle>
          <CardDescription>Las emociones que has añadido.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <ScrollArea className="h-full pr-4 -mr-4">
            {emotionsList.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {emotionsList.map((em) => (
                  <Card 
                    key={em.id} 
                    className="p-4 text-center border-2 flex flex-col items-center justify-center aspect-square transition-all group relative hover:scale-105 hover:shadow-md" 
                    style={{ borderColor: em.color }}
                  >
                    <p className="text-4xl mb-2">{em.icon}</p>
                    <p className="font-bold truncate w-full" style={{ color: em.color }}>{em.name}</p>
                    <p className="text-xs text-muted-foreground w-full overflow-hidden text-ellipsis whitespace-nowrap">{em.description}</p>
                    <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEditEmotion(em)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Esto eliminará permanentemente la emoción y todas las entradas del diario asociadas a ella.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onDeleteEmotion(em.id)}>Eliminar</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                <p>Tu emocionario está esperando a que lo llenes.</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
