"use client";

import React, { useLayoutEffect, useRef, useState, RefObject, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TourStepData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';

interface TourPopupProps {
  step: number;
  steps: TourStepData[];
  refs: { [key: string]: RefObject<HTMLElement> };
  onNext: () => void;
  onSkip: () => void;
}

export function TourPopup({ step, steps, refs, onNext, onSkip }: TourPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number; width: number; height: number }>({ top: 0, left: 0, width: 0, height: 0 });
  const [popupPosition, setPopupPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });
  const { isMobile, setOpenMobile, openMobile } = useSidebar();
  const animationFrameId = useRef<number>();

  const calculatePosition = () => {
    const currentStepData = steps[step - 1];
    if (!currentStepData) return false;
  
    const targetRef = refs[currentStepData.refKey];
    const targetElement = targetRef?.current;
  
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      
      if (rect.width > 0 && rect.height > 0) {
        setPosition({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
  
        const popupElement = popupRef.current;
        if (popupElement) {
          const popupRect = popupElement.getBoundingClientRect();
          let top = rect.bottom + 16;
          let left = rect.left + rect.width / 2 - popupRect.width / 2;
          
          if (top + popupRect.height > window.innerHeight) {
              top = rect.top - popupRect.height - 16;
          }
  
          if (left < 16) left = 16;
          if (left + popupRect.width > window.innerWidth - 16) {
              left = window.innerWidth - popupRect.width - 16;
          }
  
          setPopupPosition({ top, left });
        }
        return true; // Position calculated successfully
      }
    }
    return false; // Element not ready
  };

  useEffect(() => {
    if (step === 0) {
      setPosition({ top: 0, left: 0, width: 0, height: 0 });
      return;
    }

    const currentStepData = steps[step - 1];
    if (!currentStepData) return;

    if (isMobile) {
      setOpenMobile(true);
    }

    // Cancel any previous animation frame loop
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    
    // On both mobile and desktop, we might need to wait for the element to be ready.
    const startTime = performance.now();
    const maxWaitTime = 1000; // 1 second timeout

    const waitForElement = (timestamp: number) => {
        if (performance.now() - startTime > maxWaitTime) {
            console.warn("TourPopup: Waited too long for element to become visible.");
            return;
        }

        if (calculatePosition()) {
            // Position calculated, stop the loop
            return;
        }

        // If not ready, try again on the next frame
        animationFrameId.current = requestAnimationFrame(waitForElement);
    };

    animationFrameId.current = requestAnimationFrame(waitForElement);

    return () => {
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }
    };
  }, [step, isMobile, openMobile, setOpenMobile, steps, refs]);


  const handleNext = () => {
    onNext();
    if (isMobile && step === steps.length) {
      setOpenMobile(false);
    }
  };

  const handleSkip = () => {
    onSkip();
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  if (step === 0 || !steps[step - 1] || position.width === 0) {
    return null;
  }

  const { title, description } = steps[step - 1];

  return (
    <div className="fixed inset-0 z-40">
      {/* Highlight */}
      <div
        className="fixed transition-all duration-300 ease-in-out border-2 border-accent rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
        style={{
          top: `${position.top - 4}px`,
          left: `${position.left - 4}px`,
          width: `${position.width + 8}px`,
          height: `${position.height + 8}px`,
        }}
      />

      {/* Popup */}
      <div
        ref={popupRef}
        className={cn("fixed bg-card text-card-foreground p-4 rounded-lg shadow-2xl w-72 z-50 transition-all duration-300 ease-in-out", position.width === 0 ? 'opacity-0' : 'opacity-100')}
        style={{
          top: `${popupPosition.top}px`,
          left: `${popupPosition.left}px`,
        }}
      >
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex justify-between mt-4">
          <Button variant="ghost" onClick={handleSkip}>Saltar</Button>
          <Button onClick={handleNext} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {step === steps.length ? 'Finalizar' : 'Siguiente'}
          </Button>
        </div>
      </div>
    </div>
  );
}
