"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Clipboard, Check } from 'lucide-react';
import type { DiaryEntry, Emotion, UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ShareViewProps {
  diaryEntries: DiaryEntry[];
  emotionsList: Emotion[];
  userProfile: UserProfile | null;
}

export function ShareView({ diaryEntries, emotionsList, userProfile }: ShareViewProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const getEmotionById = (id: string) => (emotionsList || []).find(e => e.id === id);

  const reportText = useMemo(() => {
    let text = `Diario de Emociones de ${userProfile?.name || 'Usuario'}\n`;
    if (startDate && endDate) {
      const start = new Date(startDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
      const end = new Date(endDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
      text += `Periodo: ${start} - ${end}\n`;
    }
    text += "========================================\n\n";
    text += "--- Mis Entradas ---\n\n";

    const filteredEntries = diaryEntries.filter(entry => {
        if (!startDate || !endDate) return true;
        const entryDate = new Date(entry.date);
        // Add one day to endDate to include it in the range
        const endRangeDate = new Date(endDate);
        endRangeDate.setDate(endRangeDate.getDate() + 1);

        return entryDate >= new Date(startDate) && entryDate < endRangeDate;
    });

    if (filteredEntries.length > 0) {
        filteredEntries.forEach(entry => {
            const emotion = getEmotionById(entry.emotionId);
            const date = new Date(entry.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
            text += `Fecha: ${date}\n`;
            text += `Emoción: ${emotion?.name || 'Desconocida'} ${emotion?.icon || ''}\n`;
            text += `Reflexión: ${entry.text}\n`;
            text += "----------------------------------------\n";
        });
    } else {
        text += "No hay entradas en el diario para el rango de fechas seleccionado.\n\n";
    }

    text += "\n--- Mi Emocionario ---\n\n";
    (emotionsList || []).forEach(emotion => {
        text += `${emotion.icon} ${emotion.name}: ${emotion.description}\n`;
    });

    if (!emotionsList || emotionsList.length === 0) {
        text += "El emocionario está vacío.\n";
    }

    return text;
  }, [diaryEntries, emotionsList, userProfile, startDate, endDate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText).then(() => {
        setCopied(true);
        toast({ title: "¡Copiado!", description: "El reporte se ha copiado al portapapeles." });
        setTimeout(() => setCopied(false), 2000);
    }, () => {
        toast({ title: "Error", description: "No se pudo copiar el reporte.", variant: "destructive" });
    });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto h-full shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Compartir Diario</CardTitle>
        <CardDescription>Copia un resumen de tu diario en formato de texto para compartirlo con quien quieras.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
                <Label htmlFor="start-date">Fecha de inicio</Label>
                <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </div>
            <div className="flex-1 space-y-2">
                <Label htmlFor="end-date">Fecha de fin</Label>
                <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>
        </div>

        <Button onClick={handleCopy} className="bg-accent hover:bg-accent/90 text-accent-foreground w-full">
          {copied ? <Check className="mr-2 h-4 w-4" /> : <Clipboard className="mr-2 h-4 w-4" />}
          {copied ? '¡Reporte Copiado!' : 'Copiar Reporte al Portapapeles'}
        </Button>
        <Textarea
          readOnly
          value={reportText}
          className="flex-grow bg-muted/50 resize-none"
          rows={15}
        />
      </CardContent>
    </Card>
  );
}
