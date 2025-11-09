
'use client';

import React, { Suspense, useCallback } from 'react';
import EmotionExplorer from '@/app/components/emotion-explorer';
import {
  FirebaseClientProvider,
  useUser,
  useFirebase,
} from '@/firebase';
import LoginView from './components/views/login-view';
import { useToast } from '@/hooks/use-toast';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';


function AppGate() {
  const { user, isUserLoading } = useUser();
  const { auth } = useFirebase();
  const { toast } = useToast();

  const handleGoogleSignIn = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión con Google",
        description: error.message || "No se pudo iniciar sesión con Google.",
      });
    }
  }, [auth, toast]);

  const handleEmailSignIn = useCallback(async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
       toast({ variant: "destructive", title: "Error al iniciar sesión", description: "Credenciales incorrectas. Inténtalo de nuevo." });
    }
  }, [auth, toast]);

  const handleEmailSignUp = useCallback(async (email: string, pass: string) => {
    try {
        await createUserWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            toast({ variant: "destructive", title: "Correo ya en uso", description: "Este correo ya está registrado. Por favor, inicia sesión." });
        } else {
            toast({ variant: "destructive", title: "Error al crear cuenta", description: error.message || "No se pudo crear la cuenta." });
        }
    }
  }, [auth, toast]);

  if (isUserLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center flex-col gap-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg text-primary">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginView 
              onGoogleSignIn={handleGoogleSignIn} 
              onEmailSignIn={handleEmailSignIn}
              onEmailSignUp={handleEmailSignUp}
            />;
  }
  
  return <EmotionExplorer user={user} />;
}

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <FirebaseClientProvider>
        <Suspense
          fallback={
            <div className="flex h-screen w-screen items-center justify-center">
              Cargando...
            </div>
          }
        >
          <AppGate />
        </Suspense>
      </FirebaseClientProvider>
    </main>
  );
}
