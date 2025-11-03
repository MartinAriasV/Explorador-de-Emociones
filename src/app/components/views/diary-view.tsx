"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { DiaryEntry, Emotion, View } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { suggestCalmingExercise } from '@/ai/flows/suggest-calming-exercise';
import { Edit, Trash2 } from 'lucide-react';

interface DiaryViewProps {
  emotionsList: Emotion[] | null;
  diaryEntries: DiaryEntry[];
  addDiaryEntry: (entry: Omit<DiaryEntry, 'id' | 'userProfileId'>) => void;
  updateDiaryEntry: (entry: DiaryEntry) => void;
  deleteDiaryEntry: (entryId: string) => void;
  setView: (view: View) => void;
}

export function DiaryView({ emotionsList = [], diaryEntries, addDiaryEntry, updateDiaryEntry, deleteDiaryEntry, setView }: DiaryViewProps) {
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEmotionId, setSelectedEmotionId] = useState<string>('');
  const [text, setText] = useState('');
  
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);

  useEffect(() => {
    if (editingEntry) {
      setDate(editingEntry.date);
      setSelectedEmotionId(editingEntry.emotionId);
      setText(editingEntry.text);
    } else {
      resetForm();
    }
  }, [editingEntry]);

  const resetForm = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setSelectedEmotionId('');
    setText('');
    setEditingEntry(null);
  };

  const handleEditClick = (entry: DiaryEntry) => {
    setEditingEntry(entry);
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !selectedEmotionId || !text) return;
    
    const entryData = { date, emotionId: selectedEmotionId, text };

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
        {/* Columna del formulario */}
        <Card className="w-full shadow-lg flex flex-col">
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
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full"
                    required
                  />
                  <Select value={selectedEmotionId} onValueChange={setSelectedEmotionId} required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Elige una emoción" />
                    </SelectTrigger>
                    <SelectContent>
                      {emotionsList.map((emotion) => (
                        <SelectItem key={emotion.id} value={emotion.id}>
                          <div className="flex items-center gap-2">
                            <span>{emotion.icon}</span>
                            <span>{emotion.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="¿Qué pasó hoy?"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-grow"
                    rows={6}
                    required
                  />
                  <div className="flex gap-2 mt-auto">
                    {editingEntry && (
                      <Button type="button" variant="outline" onClick={handleCancelEdit} className="w-full">
                        Cancelar
                      </Button>
                    )}
                    <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full">
                      {editingEntry ? 'Guardar Cambios' : 'Guardar Entrada'}
                    </Button>
                  </div>
                </form>
              )}
          </CardContent>
        </Card>

        {/* Columna de las entradas */}
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
                      <Card key={entry.id} className="p-4 group relative">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl mt-1">{emotion?.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <p className="font-bold" style={{ color: emotion?.color }}>{emotion?.name}</p>
                                <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric'})}</p>
                            </div>
                            <p className="text-sm text-foreground/80">{entry.text}</p>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick(entry)}>
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
      
      <AlertDialog open={!!aiSuggestion || isSuggestionLoading}>
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
              <AlertDialogAction onClick={() => setAiSuggestion('')} className="bg-accent text-accent-foreground hover:bg-accent/90">
                Entendido
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
