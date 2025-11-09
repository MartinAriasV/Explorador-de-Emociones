"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { Emotion } from '@/lib/types';
import { Sparkles, Loader, Trash2, Edit, Wand2 } from 'lucide-react';
import { defineEmotionMeaning } from '@/ai/flows/define-emotion-meaning';
import { validateEmotion } from '@/ai/flows/validate-emotion';
import { useToast } from '@/hooks/use-toast';
import { AVATAR_EMOJIS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EmocionarioViewProps {
  emotionsList: Emotion[];
  addEmotion: (emotion: Omit<Emotion, 'id' | 'userId'> & { id?: string }) => void;
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
  const [isSaving, setIsSaving] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !icon || !color) {
      toast({ title: "Faltan campos", description: "Asegúrate de que la emoción tenga un nombre y un icono.", variant: "destructive" });
      return;
    };

    setIsSaving(true);
    try {
      const validationResult = await validateEmotion({ emotion: name });
      if (!validationResult.isValid) {
        toast({
          title: "Emoción no válida",
          description: `"${name}" no parece ser una emoción. ${validationResult.reason}`,
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }

      const emotionData: Omit<Emotion, 'id' | 'userId'> & { id?: string } = {
        name,
        icon,
        color,
        description,
        isCustom: true, // Mark as custom when created from this form
      };
      
      if (editingEmotion) {
        emotionData.id = editingEmotion.id;
        // Preserve the original isCustom flag when editing
        emotionData.isCustom = editingEmotion.isCustom; 
      }
      
      addEmotion(emotionData);

      if (editingEmotion) {
        onCancelEdit();
      } else {
        resetForm();
      }
    } catch (error) {
      console.error("Error saving emotion:", error);
      toast({ title: "Error al guardar", description: "No se pudo validar o guardar la emoción.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <Card className="w-full shadow-lg flex-shrink-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold" style={{ color: editingEmotion ? color : 'var(--primary)' }}>
            {editingEmotion ? 'Editar Emoción' : 'Añadir Emoción'}
          </CardTitle>
          <CardDescription>{editingEmotion ? `Modificando "${editingEmotion.name}"` : 'Crea una nueva emoción para tu diario.'}</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 md:gap-6 items-start">
              <div className="space-y-4">
                <Input
                  placeholder="Nombre de la Emoción (ej. Euforia)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
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
              </div>
              <div className="space-y-4">
                 <div>
                    <ScrollArea className="h-32 md:h-40 w-full">
                      <div className="grid grid-cols-8 gap-2 p-2 rounded-lg bg-muted/50">
                        {AVATAR_EMOJIS.map((emoji, index) => (
                            <button
                                type="button"
                                key={`${emoji}-${index}`}
                                onClick={() => setIcon(emoji)}
                                className={cn(
                                    'text-2xl md:text-3xl p-1 rounded-lg transition-all flex items-center justify-center aspect-square',
                                    icon === emoji ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-primary/10'
                                )}
                            >
                                {emoji}
                            </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                 <div className="flex flex-col sm:flex-row items-center gap-4">
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
                    <div className="flex-grow flex gap-2 w-full">
                        {editingEmotion && (
                        <Button type="button" variant="outline" onClick={onCancelEdit} className="w-full">
                            Cancelar
                        </Button>
                        )}
                        <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full" disabled={isSaving}>
                          {isSaving && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                          {isSaving ? (editingEmotion ? 'Actualizando...' : 'Añadiendo...') : (editingEmotion ? 'Actualizar' : 'Añadir')}
                        </Button>
                    </div>
                 </div>
              </div>
            </form>
        </CardContent>
      </Card>
      <Card className="w-full shadow-lg flex flex-col flex-grow min-h-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Tu Emocionario</CardTitle>
          <CardDescription>Las emociones que has añadido.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <ScrollArea className="w-full whitespace-nowrap">
            {emotionsList.length > 0 ? (
              <div className="flex w-max space-x-4 pb-4">
                {emotionsList.map((em) => (
                  <Card key={em.id} className="group relative w-64 md:w-72 overflow-hidden" style={{borderLeft: `4px solid ${em.color}`}}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <span className="text-3xl mt-1">{em.icon}</span>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-foreground truncate">{em.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-3">{em.description || 'Sin descripción'}</p>
                        </div>
                        {em.isCustom && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="absolute top-2 right-2 bg-accent text-accent-foreground p-1 rounded-full">
                                  <Wand2 className="h-3 w-3" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Emoción Personalizada</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <div className="absolute top-0 right-0 bottom-0 flex items-center justify-end gap-1 p-2 bg-gradient-to-l from-card via-card to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
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
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente la emoción y todas las entradas del diario asociadas.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDeleteEmotion(em.id)}>Eliminar</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                <p>Tu emocionario está esperando a que lo llenes.</p>
              </div>
            )}
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
