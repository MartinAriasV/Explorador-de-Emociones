"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFirebase } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

function GoogleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.28-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,36.596,44,30.836,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
        </svg>
    )
}


export default function LoginView() {
    const { auth } = useFirebase();
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    const handleGoogleSignIn = async () => {
        setIsSubmitting(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error de inicio de sesión con Google",
                description: error.message || "No se pudo iniciar sesión con Google.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            toast({
                variant: "destructive",
                title: "Correo electrónico no válido",
                description: "Por favor, introduce una dirección de correo electrónico válida.",
            });
            return;
        }
        setIsSubmitting(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            if (error.code === 'auth/invalid-credential') {
                toast({
                    variant: "destructive",
                    title: "Credenciales no válidas",
                    description: "El correo electrónico o la contraseña son incorrectos.",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error al iniciar sesión",
                    description: error.message || "No se pudo iniciar sesión. Por favor, inténtalo de nuevo.",
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
         if (!validateEmail(email)) {
            toast({
                variant: "destructive",
                title: "Correo electrónico no válido",
                description: "Por favor, introduce una dirección de correo electrónico válida para crear una cuenta.",
            });
            return;
        }
        if (password.length < 6) {
            toast({
                variant: "destructive",
                title: "Contraseña débil",
                description: "La contraseña debe tener al menos 6 caracteres.",
            });
            return;
        }
        setIsSubmitting(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
             if (error.code === 'auth/email-already-in-use') {
                toast({
                    variant: "destructive",
                    title: "El correo electrónico ya está en uso",
                    description: "Esta dirección de correo electrónico ya está registrada. Por favor, inicia sesión.",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error al crear la cuenta",
                    description: error.message || "No se pudo crear la cuenta. Por favor, inténtalo de nuevo.",
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen w-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20 animate-gradient-slow z-0"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10 z-0"></div>
            
            <Card className="w-full max-w-sm mx-auto z-10 bg-card/80 backdrop-blur-lg border-white/20 shadow-2xl animate-fade-in-up">
                <CardHeader className="text-center space-y-4">
                    <Sparkles className="w-12 h-12 text-primary mx-auto" />
                    <div className="space-y-1">
                        <CardTitle className="text-3xl font-bold text-primary">Diario de Emociones</CardTitle>
                        <CardDescription>Inicia sesión o crea una cuenta para continuar</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Button onClick={handleGoogleSignIn} disabled={isSubmitting} className="w-full" variant="outline">
                            <GoogleIcon />
                            <span>{isSubmitting ? 'Iniciando...' : 'Iniciar Sesión con Google'}</span>
                        </Button>
                        <div className="flex items-center space-x-2">
                            <Separator className="flex-1" />
                            <span className="text-xs text-muted-foreground">O CONTINÚA CON</span>
                            <Separator className="flex-1" />
                        </div>
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} className="bg-background/70"/>
                                </div>
                                <div>
                                    <Label htmlFor="password">Contraseña</Label>
                                    <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} className="bg-background/70" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button type="submit" onClick={handleEmailSignUp} disabled={isSubmitting} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                                    {isSubmitting ? 'Creando...' : 'Crear Cuenta'}
                                </Button>
                                <Button type="submit" variant="outline" onClick={handleEmailSignIn} disabled={isSubmitting} className="w-full">
                                    {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
