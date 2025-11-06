"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFirebase } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';

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
