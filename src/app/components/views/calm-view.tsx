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
    { text: 'Pausa', duration: 2000, animation: 'animate-breathe-hold' },
  ],
  '4-7-8': [
    { text: 'Inhala', duration: 4000, animation: 'animate-breathe-in' },
    { text: 'Sostén', duration: 7000, animation: 'animate-breathe-hold' },
    { text: 'Exhala', duration: 8000, animation: 'animate-breathe-out' },
  ],
};

const PREP_TIME = 3000;

export function CalmView() {
  const [mode, setMode] = useState<BreathMode>('circle');
  const [currentStep, setCurrentStep] = useState<BreathStep | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isPreparing, setIsPreparing] = useState(true);
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
    setIsPreparing(true);
    setCurrentStep(null);
    setCountdown(PREP_TIME / 1000);

    const prepInterval = setInterval(() => {
      setCountdown(prev => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    
    const initialTimeout = setTimeout(() => {
      clearInterval(prepInterval);
      setIsPreparing(false);
      let cycleIndex = -1;
      const cycle = breathCycles[mode];

      const runCycle = () => {
        cycleIndex = (cycleIndex + 1) % cycle.length;
        const step = cycle[cycleIndex];
        
        setCurrentStep(step);
        let counter = 1;
        setCountdown(counter);

        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = setInterval(() => {
          counter++;
          setCountdown(counter);
        }, 1000);
        
        stepTimeoutRef.current = setTimeout(() => {
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          runCycle();
        }, step.duration);
      };
      runCycle();
    }, PREP_TIME);

    return () => {
      cleanupTimers();
      clearInterval(prepInterval);
      clearTimeout(initialTimeout);
    };
  }, [mode, isClient]);

  const animationStyle = {
    animationName: currentStep?.animation.replace('animate-',''),
    animationDuration: currentStep ? `${currentStep.duration}ms` : 'none',
    animationTimingFunction: 'ease-in-out',
    animationFillMode: 'forwards',
  } as React.CSSProperties;
  
  const nextActionText = breathCycles[mode][0].text;

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
            "w-60 h-60 flex items-center justify-center transition-all duration-500",
            isPreparing ? 'bg-accent/80' : 'bg-primary/80',
            mode === 'circle' ? 'rounded-full' : 'rounded-xl'
          )}
          style={!isPreparing ? animationStyle : {}}
        >
            <div className={cn("text-center", isPreparing ? 'text-accent-foreground' : 'text-primary-foreground')}>
              {isPreparing ? (
                <>
                  <p className="text-xl">Prepárate para:</p>
                  <p className="text-2xl font-bold">{nextActionText}</p>
                  <p className="text-xl font-mono mt-2">en {countdown}</p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold">
                      {currentStep ? currentStep.text : "..."}
                  </p>
                  {currentStep && (
                      <p className="text-xl font-mono">{countdown}</p>
                  )}
                </>
              )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
