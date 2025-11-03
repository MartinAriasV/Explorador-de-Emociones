"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import type { DiaryEntry } from '@/lib/types';
import { cn, normalizeDate } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StreakViewProps {
  diaryEntries: DiaryEntry[];
}

export function StreakView({ diaryEntries }: StreakViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  // Adjust startingDayOfWeek to be 0 for Monday
  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const entryDates = useMemo(() => {
    return new Set(diaryEntries.map(entry => normalizeDate(entry.date)));
  }, [diaryEntries]);

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }, [startingDayOfWeek, daysInMonth]);
  
  const weekdays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <Card className="w-full h-full shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary">Mi Racha de Emociones</CardTitle>
        <CardDescription>¡Sigue así! Cada día que registras una emoción, la llama de tu racha se hace más fuerte.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft />
          </Button>
          <h3 className="text-xl font-bold text-primary capitalize">
            {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
          </h3>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center font-semibold text-muted-foreground mb-2">
          {weekdays.map(day => <div key={day} className="text-xs md:text-sm">{day}</div>)}
        </div>
        <div className="grid grid-cols-7 grid-rows-6 gap-2 flex-grow">
          {calendarDays.map((day, index) => {
            if (!day) return <div key={`empty-${index}`} className="bg-muted/30 rounded-lg" />;
            
            const calendarDate = normalizeDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
            const hasEntry = entryDates.has(calendarDate);

            const today = normalizeDate(new Date());
            const isToday = calendarDate === today;
            const isPast = calendarDate < today;

            let status: 'completed' | 'missed' | 'future' | 'today' = 'future';
            if (isToday) {
                status = 'today';
            } else if (isPast) {
                status = hasEntry ? 'completed' : 'missed';
            }

            return (
              <TooltipProvider key={day}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "border rounded-lg p-2 flex flex-col items-center justify-center aspect-square transition-all duration-300",
                        status === 'completed' && "bg-amber-100 border-amber-300",
                        status === 'missed' && "bg-gray-100 border-gray-200 opacity-60",
                        status === 'today' && "border-primary border-2 ring-4 ring-primary/20",
                        status === 'future' && "bg-background",
                      )}
                    >
                      <span className={cn("font-bold text-lg", status === 'missed' && 'text-muted-foreground/50')}>{day}</span>
                      <div className="text-3xl mt-1">
                        {hasEntry ? <Flame className="text-amber-500"/> : isPast ? '⚪' : '⚫'}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{new Date(calendarDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    {hasEntry && <p className="font-bold text-amber-600">¡Meta cumplida!</p>}
                    {status === 'missed' && <p className="font-bold text-gray-500">Día omitido</p>}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
