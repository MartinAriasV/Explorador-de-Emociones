"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type BreathMode = 'circle' | 'square' | '4-7-8';

const breathCycles = {
  circle: [
    { text: 'Inhala por', duration: 4000, animation: 'animate-breathe-circle' },
    { text: 'Exhala por', duration: 4000, animation: '' },
  ],
  square: [
    { text: 'Inhala por', duration: 4000, animation: 'animate-breathe-in' },
    { text: 'Sostén por', duration: 4000, animation: 'animate-breathe-hold' },
    { text: 'Exhala por', duration: 4000, animation: 'animate-breathe-out' },
    { text: 'Sostén por', duration: 4000, animation: 'animate-breathe-hold' },
  ],
  '4-7-8': [
    { text: 'Inhala por', duration: 4000, animation: 'animate-breathe-in' },
    { text: 'Sostén por', duration: 7000, animation: 'animate-breathe-hold' },
    { text: 'Exhala por', duration: 8000, animation: 'animate-breathe-out' },
  ],
};

export function CalmView() {
  const [mode, setMode] = useState<BreathMode>('circle');
  const [breathText, setBreathText] = useState('Prepárate...');
  const [animationClass, setAnimationClass] = useState('');
  const [isClient, setIsClient] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Clear any existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    setBreathText('Prepárate...');
    setAnimationClass('');
    let cycleIndex = -1;
    
    const cycle = breathCycles[mode];

    const runCycle = () => {
      // Clear previous interval if any
      if (intervalRef.current) clearInterval(intervalRef.current);

      cycleIndex = (cycleIndex + 1) % cycle.length;
      const currentStep = cycle[cycleIndex];
      
      const totalSeconds = currentStep.duration / 1000;
      let count = totalSeconds;

      setBreathText(`${currentStep.text} ${count}...`);
      setAnimationClass(currentStep.animation);
      
      intervalRef.current = setInterval(() => {
        count--;
        if (count > 0) {
          setBreathText(`${currentStep.text} ${count}...`);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }, 1000);
      
      timeoutRef.current = setTimeout(runCycle, currentStep.duration);
    };

    const initialTimeout = setTimeout(runCycle, 2000); // Initial delay

    return () => {
      clearTimeout(initialTimeout);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [mode, isClient]);

  const getAnimationDuration = () => {
    if (mode === 'circle') return '4s';
    const currentStep = breathCycles[mode].find(step => step.animation === animationClass);
    return currentStep ? `${currentStep.duration / 1000}s` : '4s';
  }

  return (
    <Card className="w-full h-full shadow-lg flex flex-col items-center justify-center text-center">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-primary">Rincón de la Calma</CardTitle>
        <CardDescription>Elige un ejercicio de respiración y sigue al guía visual.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-8">
        <div className="flex gap-2 p-1 bg-primary/10 rounded-lg">
          {(['circle', 'square', '4-7-8'] as BreathMode[]).map((m) => (
            <Button
              key={m}
              onClick={() => setMode(m)}
              variant={mode === m ? 'default' : 'ghost'}
              className={cn(mode === m ? 'bg-primary' : 'text-primary', 'capitalize')}
            >
              {m === 'circle' ? 'Círculo' : m === 'square' ? 'Cuadrada' : '4-7-8'}
            </Button>
          ))}
        </div>
        <div 
          className={cn(
            "w-60 h-60 bg-primary/80 flex items-center justify-center transition-all duration-500",
            mode === 'circle' ? 'rounded-full' : 'rounded-xl',
            animationClass
          )}
          style={{ animationDuration: getAnimationDuration(), animationIterationCount: mode === 'circle' ? 'infinite' : 1 }}
        >
          <p className="text-2xl font-bold text-primary-foreground">{breathText}</p>
        </div>
      </CardContent>
    </Card>
  );
}
