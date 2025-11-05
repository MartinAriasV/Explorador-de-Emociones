"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DiaryEntry, Emotion } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

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
        entryDate.getUTCFullYear() === currentDate.getFullYear() &&
        entryDate.getUTCMonth() === currentDate.getMonth() &&
        entryDate.getUTCDate() === day
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
      <CardContent className="flex-grow flex flex-col min-h-0">
        <div className="grid grid-cols-7 gap-1 md:gap-2 text-center font-bold text-muted-foreground">
          {weekdays.map(day => <div key={day} className="text-xs md:text-sm">{day}</div>)}
        </div>
        <ScrollArea className="flex-grow mt-2">
            <div className="grid grid-cols-7 gap-1 md:gap-2">
            <TooltipProvider>
            {calendarDays.map((day, index) => {
                if (!day) return <div key={`empty-${index}`} />;
                
                const dayEntries = getEntriesForDay(day);

                const today = new Date();
                const isToday = today.getFullYear() === currentDate.getFullYear() &&
                                today.getMonth() === currentDate.getMonth() &&
                                today.getDate() === day;
                
                const isPast = new Date(currentDate.getFullYear(), currentDate.getMonth(), day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

                return (
                <Tooltip key={day} delayDuration={100}>
                  <TooltipTrigger asChild>
                    <div
                        className={cn(
                        "border rounded-lg p-1 md:p-2 flex flex-col items-center justify-between aspect-square overflow-hidden transition-all duration-200",
                        isToday && "ring-2 ring-primary",
                        dayEntries.length === 0 && isPast && "bg-muted/50",
                        dayEntries.length > 0 && "hover:scale-105 hover:shadow-md cursor-pointer",
                        )}
                        style={dayEntries.length > 0 ? { borderColor: getEmotionById(dayEntries[0].emotionId)?.color } : {}}
                    >
                        <span className={cn("font-bold self-start text-xs md:text-sm", dayEntries.length === 0 && 'text-muted-foreground')}>{day}</span>
                        
                        <div className="flex flex-col items-center justify-center flex-grow">
                          {dayEntries.length > 0 ? (
                            <span className="text-2xl md:text-4xl">{getEmotionById(dayEntries[0].emotionId)?.icon || '❓'}</span>
                          ) : (
                            isPast && <div className="w-2 h-2 rounded-full bg-muted-foreground/20"></div>
                          )}
                        </div>

                        <div className="h-4 flex items-end">
                           {dayEntries.length > 1 && (
                            <div className="flex space-x-1">
                              {dayEntries.slice(0, 3).map((entry, i) => (
                                <div key={entry.id} className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: getEmotionById(entry.emotionId)?.color || 'grey'}}></div>
                              ))}
                            </div>
                           )}
                        </div>
                    </div>
                  </TooltipTrigger>
                  {dayEntries.length > 0 && (
                    <TooltipContent className="p-4 bg-card border-primary">
                        <div className="flex flex-col gap-3">
                        {dayEntries.map(entry => {
                            const emotion = getEmotionById(entry.emotionId);
                            return (
                                <div key={entry.id} className="max-w-xs">
                                <p className="font-bold flex items-center gap-2" style={{color: emotion?.color}}>
                                    <span className="text-xl">{emotion?.icon}</span>
                                    {emotion?.name}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">{entry.text}</p>
                                </div>
                            );
                        })}
                        </div>
                    </TooltipContent>
                  )}
                </Tooltip>
                );
            })}
            </TooltipProvider>
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
