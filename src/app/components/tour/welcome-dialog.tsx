"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface WelcomeDialogProps {
    open: boolean;
    onStartTour: () => void;
    onSkipTour: () => void;
}

export function WelcomeDialog({ open, onStartTour, onSkipTour }: WelcomeDialogProps) {
    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onSkipTour()}>
            <DialogContent className="sm:max-w-[425px]" hideCloseButton>
                <DialogHeader>
                    <DialogTitle className="flex flex-col items-center text-center gap-2 text-2xl">
                        <Sparkles className="w-10 h-10 text-accent" />
                        ¡Te damos la bienvenida a Diario de Emociones!
                    </DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        Esta es una herramienta para ayudarte a entender y registrar tus emociones.
                        ¿Te gustaría hacer un tour rápido para conocer las funciones principales?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-center pt-4 flex-row gap-2">
                    <Button type="button" variant="ghost" onClick={onSkipTour}>
                        Saltar Tour
                    </Button>
                    <Button type="button" onClick={onStartTour} className="bg-accent text-accent-foreground hover:bg-accent/90">
                        Empezar Tour
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
