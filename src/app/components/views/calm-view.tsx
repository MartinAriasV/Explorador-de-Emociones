"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type BreathMode = 'circle' | 'square' | '4-7-8';

interface BreathStep {
  text: string;
  duration: number;
  animation: string;
}

const breathCycles: Record<BreathMode, BreathStep[]> = {
  circle: [
    { text: 'Inhala', duration: 4000, animation: 'animate-breathe-in' },
    { text: 'Exhala', duration: 6000, animation: 'animate-breathe-out' },
  ],
  square: [
    { text: 'Inhala', duration: 4000, animation: 'animate-breathe-in' },
    { text: 'Sostén', duration: 4000, animation: 'animate-breathe-hold' },
    { text: 'Exhala', duration: 4000, animation: 'animate-breathe-out' },
    { text: 'Sostén', duration: 4000, animation: 'animate-breathe-hold' },
  ],
  '4-7-8': [
    { text: 'Inhala', duration: 4000, animation: 'animate-breathe-in' },
    { text: 'Sostén', duration: 7000, animation: 'animate-breathe-hold' },
    { text: 'Exhala', duration: 8000, animation: 'animate-breathe-out' },
  ],
};

export function CalmView() {
  const [mode, setMode] = useState<BreathMode>('circle');
  const [currentStep, setCurrentStep] = useState<BreathStep | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const stepTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Interval | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const cleanupTimers = () => {
      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };

    cleanupTimers();
    setCurrentStep(null);
    setCountdown(0);
    
    let cycleIndex = -1;
    const cycle = breathCycles[mode];

    const runCycle = () => {
      cycleIndex = (cycleIndex + 1) % cycle.length;
      const step = cycle[cycleIndex];
      
      setCurrentStep(step);
      const durationSeconds = step.duration / 1000;
      setCountdown(durationSeconds);
      
      countdownIntervalRef.current = setInterval(() => {
        setCountdown(prev => (prev > 1 ? prev - 1 : 0));
      }, 1000);
      
      stepTimeoutRef.current = setTimeout(runCycle, step.duration);
    };

    // Initial "get ready" state
    const initialTimeout = setTimeout(runCycle, 2000);

    return () => {
      cleanupTimers();
      clearTimeout(initialTimeout);
    };
  }, [mode, isClient]);

  const animationStyle = {
    animationName: currentStep?.animation.replace('animate-',''),
    animationDuration: currentStep ? `${currentStep.duration}ms` : 'none',
    animationTimingFunction: 'ease-in-out',
    animationFillMode: 'forwards',
  } as React.CSSProperties;

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
            mode === 'circle' ? 'rounded-full' : 'rounded-xl'
          )}
          style={animationStyle}
        >
            <div className="text-center text-primary-foreground">
                <p className="text-2xl font-bold">
                    {currentStep ? currentStep.text : "Prepárate..."}
                </p>
                {currentStep && (
                    <p className="text-xl font-mono">{countdown}</p>
                )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
