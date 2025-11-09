
"use client";

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';


function GoogleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.28-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,36.596,44,30.836,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
g" />
        </svg>
    )
}

export default function LoginView() {
    const { toast } = useToast();
    const { auth } = useFirebase();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleGoogleSignIn = useCallback(async () => {
        setIsSubmitting(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            // The onAuthStateChanged listener in FirebaseProvider will handle the user state change
        } catch (error: any) {
            console.error("Google Sign-In Error:", error);
            toast({
                variant: 'destructive',
                title: 'Error de inicio de sesión',
                description: error.code || error.message || 'No se pudo iniciar sesión con Google.',
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
                        <Button onClick={handleGoogleSignIn} disabled={isSubmitting} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
                            <GoogleIcon />
                            <span>{isSubmitting ? 'Iniciando...' : 'Entrar con Google'}</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

    
