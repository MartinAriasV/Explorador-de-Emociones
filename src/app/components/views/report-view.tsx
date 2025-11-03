"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DiaryEntry, Emotion } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ReportViewProps {
  diaryEntries: DiaryEntry[];
  emotionsList: Emotion[];
}

export function ReportView({ diaryEntries, emotionsList }: ReportViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // 0 for Monday

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

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
  
  const getEmotionById = (id: string) => (emotionsList || []).find(e => e.id === id);

  const getEntriesForDay = (day: number) => {
    return diaryEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getFullYear() === currentDate.getFullYear() &&
        entryDate.getMonth() === currentDate.getMonth() &&
        entryDate.getDate() === day
      );
    });
  };

  const weekdays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  return (
    <Card className="w-full h-full shadow-lg flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft />
          </Button>
          <CardTitle className="text-2xl font-bold text-primary capitalize">
            {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="grid grid-cols-7 gap-2 text-center font-semibold text-muted-foreground">
          {weekdays.map(day => <div key={day}>{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-2 mt-2 h-[calc(100%-2rem)]">
          {calendarDays.map((day, index) => {
            if (!day) return <div key={`empty-${index}`} />;
            
            const dayEntries = getEntriesForDay(day);
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

            return (
              <div
                key={day}
                className={cn(
                  "border rounded-lg p-2 flex flex-col items-center justify-start aspect-square overflow-hidden",
                  isToday && "border-primary border-2"
                )}
              >
                <span className="font-bold">{day}</span>
                <div className="flex flex-wrap items-center justify-center gap-1 mt-2 flex-grow">
                  {dayEntries.length > 0 ? (
                    <TooltipProvider>
                    {dayEntries.map(entry => {
                      const emotion = getEmotionById(entry.emotionId);
                      return (
                        <Tooltip key={entry.id}>
                          <TooltipTrigger>
                            <span className="text-xl">{emotion?.icon || '❓'}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-bold" style={{color: emotion?.color}}>{emotion?.name}</p>
                            <p className="text-sm max-w-xs truncate">{entry.text}</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                    </TooltipProvider>
                  ) : (
                    <span className="text-2xl opacity-20">😶</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
