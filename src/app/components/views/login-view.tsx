"use client";

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, User } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';


export default function LoginView() {
    const { toast } = useToast();
    const { auth } = useFirebase();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAnonymousSignIn = useCallback(async () => {
        setIsSubmitting(true);
        try {
            await signInAnonymously(auth);
            // The onAuthStateChanged listener in FirebaseProvider will handle the user state change
        } catch (error: any) {
            console.error("Anonymous Sign-In Error:", error);
            toast({
                variant: 'destructive',
                title: 'Error de inicio de sesión',
                description: error.message || 'No se pudo iniciar sesión de forma anónima.',
            });
        } finally {
            setIsSubmitting(false);
        }
    }, [auth, toast]);

    return (
        <div className="flex items-center justify-center h-screen w-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20 animate-gradient-slow z-0"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10 z-0"></div>
            
            <Card className="w-full max-w-sm mx-auto z-10 bg-card/80 backdrop-blur-lg border-white/20 shadow-2xl animate-fade-in-up">
                <CardHeader className="text-center space-y-4">
                    <Sparkles className="w-12 h-12 text-primary mx-auto" />
                    <div className="space-y-1">
                        <CardTitle className="text-3xl font-bold text-primary">Diario de Emociones</CardTitle>
                        <CardDescription>Inicia sesión para comenzar tu viaje</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Button onClick={handleAnonymousSignIn} disabled={isSubmitting} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
                            <User />
                            <span>{isSubmitting ? 'Entrando...' : 'Entrar como Invitado'}</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
