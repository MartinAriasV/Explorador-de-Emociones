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
          <TooltipProvider>
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
                <Tooltip key={day}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "border rounded-lg flex flex-col items-center justify-center aspect-square transition-all duration-300 group",
                        status === 'completed' && "bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-800",
                        status === 'missed' && "bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60",
                        status === 'today' && "border-primary border-2 ring-4 ring-primary/20",
                        status === 'future' && "bg-background dark:bg-muted/50",
                      )}
                    >
                      <span className={cn(
                          "font-bold text-sm md:text-base", 
                          status === 'missed' && 'text-muted-foreground/50'
                      )}>{day}</span>
                      
                      <div className="flex-1 flex items-center justify-center">
                        {hasEntry ? (
                            <Flame className="w-8 h-8 text-amber-500 animate-flame transition-transform duration-200 group-hover:scale-125" />
                        ) : isPast ? (
                           <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600" /> // Ash
                        ) : (
                           <div className="w-5 h-5 rounded-full bg-gray-700 dark:bg-gray-900" /> // Ember
                        )}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{new Date(calendarDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    {hasEntry && <p className="font-bold text-amber-600 dark:text-amber-400">¡Meta cumplida!</p>}
                    {status === 'missed' && <p className="font-bold text-gray-500">Día omitido</p>}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
