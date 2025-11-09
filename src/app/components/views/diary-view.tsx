"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { DiaryEntry, Emotion, View } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { suggestCalmingExercise } from '@/ai/flows/suggest-calming-exercise';
import { Edit, Trash2, Mic } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface DiaryViewProps {
  emotionsList: Emotion[];
  diaryEntries: DiaryEntry[];
  addDiaryEntry: (entry: Omit<DiaryEntry, 'id' | 'userId'>) => void;
  updateDiaryEntry: (entry: DiaryEntry) => void;
  deleteDiaryEntry: (entryId: string) => void;
  setView: (view: View) => void;
}

export function DiaryView({ emotionsList = [], diaryEntries = [], addDiaryEntry, updateDiaryEntry, deleteDiaryEntry, setView }: DiaryViewProps) {
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const formCardRef = useRef<HTMLDivElement>(null);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEmotionId, setSelectedEmotionId] = useState<string>('');
  const [text, setText] = useState('');
  
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (editingEntry) {
        const entryDate = new Date(editingEntry.date);
        const formattedDate = entryDate.toISOString().split('T')[0];
        setDate(formattedDate);
        setSelectedEmotionId(editingEntry.emotionId);
        setText(editingEntry.text);
        formCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        resetForm();
    }
  }, [editingEntry]);
  
  const handleVoiceInput = () => {
    if (typeof window === 'undefined') return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: "Navegador no compatible",
        description: "Tu navegador no soporta el dictado por voz.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(prev => prev ? prev + ' ' + transcript : transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      toast({
        title: "Error de dictado",
        description: "No se pudo entender. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };

  const resetForm = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setSelectedEmotionId('');
    setText('');
    setEditingEntry(null);
  };

  const handleCancelEdit = () => {
    resetForm();
    setEditingEntry(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !selectedEmotionId || !text) return;
    
    const utcDate = new Date(date).toISOString();
    const entryData = { date: utcDate, emotionId: selectedEmotionId, text };

    if (editingEntry) {
      updateDiaryEntry({ ...editingEntry, ...entryData });
    } else {
      addDiaryEntry(entryData);
      setIsSuggestionLoading(true);
      try {
          const result = await suggestCalmingExercise({ emotionalState: text });
          setAiSuggestion(result.exerciseSuggestion);
      } catch (error) {
          console.error("Error fetching AI suggestion:", error);
          setAiSuggestion("Could not get a suggestion at this time.");
      } finally {
          setIsSuggestionLoading(false);
      }
    }
    resetForm();
  };

  const getEmotionById = (id: string) => (emotionsList || []).find(e => e.id === id);

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-6 h-full">
        <Card ref={formCardRef} className="w-full shadow-lg flex flex-col">
           <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">
              {editingEntry ? 'Editando Entrada' : '¿Cómo te sientes hoy?'}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col gap-4 overflow-y-auto">
             {!emotionsList || emotionsList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-10">
                  <p className="text-lg text-muted-foreground mb-4">¡Tu emocionario está vacío!</p>
                  <p className="mb-4 text-muted-foreground">Añade emociones para empezar a registrar tu diario.</p>
                  <Button onClick={() => setView('emocionario')} className="bg-primary hover:bg-primary/90">
                    Ir al Emocionario
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-full">
                    <div className="space-y-2">
                        <Label htmlFor="entry-date">Fecha</Label>
                        <Input
                            id="entry-date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full"
                            required
                        />
                    </div>
                  <div className="space-y-2">
                    <Label>Emoción</Label>
                    <ScrollArea className="w-full whitespace-nowrap rounded-lg bg-muted/30">
                        <div className="flex w-max space-x-2 p-2">
                            {emotionsList.map((emotion) => (
                                <Button
                                    key={emotion.id}
                                    type="button"
                                    variant="outline"
                                    className={cn(
                                        "h-20 w-20 flex-col gap-1",
                                        selectedEmotionId === emotion.id && "ring-2 ring-primary border-primary"
                                    )}
                                    onClick={() => setSelectedEmotionId(emotion.id)}
                                >
                                    <span className="text-3xl">{emotion.icon}</span>
                                    <span className="text-xs truncate">{emotion.name}</span>
                                </Button>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                  <div className="space-y-2 flex-grow flex flex-col">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="entry-text">¿Qué pasó hoy?</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleVoiceInput}
                        className={cn(isListening && 'text-destructive animate-pulse')}
                      >
                        <Mic className="h-5 w-5" />
                        <span className="sr-only">Dictado por voz</span>
                      </Button>
                    </div>
                    <Textarea
                        id="entry-text"
                        placeholder="Describe tu día, tus pensamientos, tus sentimientos..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="flex-grow"
                        rows={6}
                        required
                    />
                  </div>
                  <div className="flex gap-2 mt-auto">
                    {editingEntry && (
                      <Button type="button" variant="outline" onClick={handleCancelEdit} className="w-full">
                        Cancelar
                      </Button>
                    )}
                    <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full" disabled={!selectedEmotionId}>
                      {editingEntry ? 'Guardar Cambios' : 'Guardar Entrada'}
                    </Button>
                  </div>
                </form>
              )}
          </CardContent>
        </Card>

        <Card className="w-full shadow-lg flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">Mis Entradas</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-full pr-4 -mr-4">
              {diaryEntries.length > 0 ? (
                <div className="space-y-4">
                  {diaryEntries.slice().reverse().map((entry) => {
                    const emotion = getEmotionById(entry.emotionId);
                    return (
                      <Card key={entry.id} className="p-4 group relative overflow-hidden" style={{ borderLeft: `4px solid ${emotion?.color || 'grey'}` }}>
                        <div className="flex items-start gap-4">
                          <span className="text-3xl mt-1">{emotion?.icon}</span>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-lg" style={{ color: emotion?.color }}>{emotion?.name}</p>
                                    <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}</p>
                                </div>
                            </div>
                            <p className="text-sm text-foreground/80 mt-2">{entry.text}</p>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingEntry(entry)}>
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
                                    Esta acción no se puede deshacer. Esto eliminará permanentemente la entrada del diario.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteDiaryEntry(entry.id)}>Eliminar</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                  <p>Aún no tienes entradas en tu diario.</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      
      <AlertDialog open={!!aiSuggestion || isSuggestionLoading} onOpenChange={(open) => !open && setAiSuggestion('')}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isSuggestionLoading ? "Analizando tu entrada..." : "Una sugerencia para ti"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isSuggestionLoading ? "Estamos generando una sugerencia de calma personalizada para ti. Un momento..." : aiSuggestion}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {!isSuggestionLoading && (
              <>
                <AlertDialogCancel>Entendido</AlertDialogCancel>
                <AlertDialogAction onClick={() => { setView('calm'); setAiSuggestion(''); }} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  ¡Llévame al Rincón de la Calma!
                </AlertDialogAction>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
