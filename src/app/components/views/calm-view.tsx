"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type BreathMode = 'circle' | 'square' | '4-7-8';

interface BreathStep {
  text: string;
  duration: number;
  animation: string;
  gradient: string;
}

const breathCycles: Record<BreathMode, BreathStep[]> = {
  circle: [
    { text: 'Inhala', duration: 4000, animation: 'animate-breathe-in', gradient: 'from-primary/70 to-blue-300/70' },
    { text: 'Exhala', duration: 6000, animation: 'animate-breathe-out', gradient: 'from-accent/70 to-pink-300/70' },
  ],
  square: [
    { text: 'Inhala', duration: 4000, animation: 'animate-breathe-in', gradient: 'from-primary/70 to-blue-300/70' },
    { text: 'Sostén', duration: 4000, animation: 'animate-breathe-hold', gradient: 'from-purple-400/70 to-indigo-400/70' },
    { text: 'Exhala', duration: 4000, animation: 'animate-breathe-out', gradient: 'from-accent/70 to-pink-300/70' },
    { text: 'Sostén', duration: 4000, animation: 'animate-breathe-hold', gradient: 'from-purple-400/70 to-indigo-400/70' },
  ],
  '4-7-8': [
    { text: 'Inhala', duration: 4000, animation: 'animate-breathe-in-triangle', gradient: 'from-primary/70 to-blue-300/70' },
    { text: 'Sostén', duration: 7000, animation: 'animate-breathe-hold', gradient: 'from-purple-400/70 to-indigo-400/70' },
    { text: 'Exhala', duration: 8000, animation: 'animate-breathe-out-triangle', gradient: 'from-accent/70 to-pink-300/70' },
  ],
};

const PREP_TIME = 3000;
const PREP_GRADIENT = 'from-gray-400/70 to-gray-500/70';

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
          if(counter < (step.duration / 1000)) {
            counter++;
            setCountdown(counter);
          }
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
    animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    animationFillMode: 'forwards',
  } as React.CSSProperties;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Rincón de la Calma</h1>
        <p className="text-muted-foreground mt-2">Elige un ejercicio de respiración y sigue al guía visual.</p>
      </div>

      <div className="flex gap-2 p-1 bg-primary/10 rounded-full mb-12">
        {(['circle', 'square', '4-7-8'] as BreathMode[]).map((m) => (
          <Button
            key={m}
            onClick={() => setMode(m)}
            variant={mode === m ? 'default' : 'ghost'}
            className={cn(mode === m ? 'bg-primary' : 'text-primary', 'capitalize rounded-full')}
          >
            {m === 'circle' ? 'Círculo' : m === 'square' ? 'Cuadrada' : '4-7-8'}
          </Button>
        ))}
      </div>
      <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
        <div 
          className={cn(
            "w-full h-full bg-gradient-to-br transition-all duration-1000",
            isPreparing ? PREP_GRADIENT : currentStep?.gradient,
            mode === 'circle' && 'rounded-full',
            mode === 'square' && 'rounded-3xl',
            mode === '4-7-8' && 'shape-triangle',
            'shadow-2xl shadow-primary/20'
          )}
          style={!isPreparing ? animationStyle : {}}
        >
        </div>
         <div className="absolute text-center text-white/90">
            {isPreparing ? (
              <>
                <p className="text-xl">Prepárate...</p>
                <p className="text-5xl font-bold font-mono mt-2">{countdown}</p>
              </>
            ) : (
              <>
                <p className="text-4xl font-semibold">
                    {currentStep ? currentStep.text : "..."}
                </p>
                {currentStep && (
                    <p className="text-2xl font-mono mt-2">{countdown}</p>
                )}
              </>
            )}
          </div>
      </div>
    </div>
  );
}
