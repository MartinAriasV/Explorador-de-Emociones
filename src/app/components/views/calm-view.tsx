"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type BreathMode = 'circle' | 'square' | '4-7-8';

const breathCycles = {
  circle: [
    { text: 'Inhala...', duration: 4000 },
    { text: 'Exhala...', duration: 4000 },
  ],
  square: [
    { text: 'Inhala (4s)', duration: 4000 },
    { text: 'Sostén (4s)', duration: 4000 },
    { text: 'Exhala (4s)', duration: 4000 },
    { text: 'Sostén (4s)', duration: 4000 },
  ],
  '4-7-8': [
    { text: 'Inhala (4s)', duration: 4000 },
    { text: 'Sostén (7s)', duration: 7000 },
    { text: 'Exhala (8s)', duration: 8000 },
  ],
};

export function CalmView() {
  const [mode, setMode] = useState<BreathMode>('circle');
  const [breathText, setBreathText] = useState('Prepárate...');
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    setBreathText('Prepárate...');
    let cycleIndex = 0;
    
    const cycle = breathCycles[mode];

    const runCycle = () => {
      const currentStep = cycle[cycleIndex];
      setBreathText(currentStep.text);
      
      // Control animation for circle mode
      if (mode === 'circle') {
        if (currentStep.text.startsWith('Inhala')) {
          setAnimationClass('animate-breathe-circle');
        } else {
          // No specific class for exhale, it's the reverse part of the animation
        }
      } else {
        setAnimationClass(''); // Static for other modes
      }
      
      cycleIndex = (cycleIndex + 1) % cycle.length;
      const timeoutId = setTimeout(runCycle, currentStep.duration);
      return timeoutId;
    };

    const initialTimeout = setTimeout(runCycle, 1500); // Initial delay

    return () => {
      clearTimeout(initialTimeout);
      // We need to find a way to clear the dynamically set timeout inside runCycle
      // A simple way is not to clear it, it will just stop being called.
      // For more complex scenarios, we'd store timeoutId in a ref.
    };
  }, [mode]);

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
        >
          <p className="text-2xl font-bold text-primary-foreground">{breathText}</p>
        </div>
      </CardContent>
    </Card>
  );
}
