"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, LogIn, UserPlus } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginView() {
    const { toast } = useToast();
    const { auth } = useFirebase();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('login');

    const resetForm = () => {
        setEmail('');
        setPassword('');
    }

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        resetForm();
    }

    const handleEmailPasswordSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // The onAuthStateChanged listener will handle the redirect
        } catch (error: any) {
             console.error("Sign-Up Error:", error);
            toast({
                variant: 'destructive',
                title: 'Error de Registro',
                description: error.code === 'auth/email-already-in-use' ? 'Este correo electrónico ya está en uso.' : (error.message || 'No se pudo crear la cuenta.'),
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // The onAuthStateChanged listener will handle the redirect
        } catch (error: any) {
             console.error("Sign-In Error:", error);
            toast({
                variant: 'destructive',
                title: 'Error al Iniciar Sesión',
                description: error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' ? 'Correo o contraseña incorrectos.' : (error.message || 'No se pudo iniciar sesión.'),
            });
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <div className="flex items-center justify-center h-screen w-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20 animate-gradient-slow z-0"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10 z-0"></div>
            
            <Card className="w-full max-w-sm mx-auto z-10 bg-card/80 backdrop-blur-lg border-white/20 shadow-2xl animate-fade-in-up">
                <CardHeader className="text-center space-y-4">
                    <Sparkles className="w-12 h-12 text-primary mx-auto" />
                    <div className="space-y-1">
                        <CardTitle className="text-3xl font-bold text-primary">Diario de Emociones</CardTitle>
                        <CardDescription>Tu espacio personal para crecer</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                   <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login"><LogIn className="mr-2"/> Iniciar Sesión</TabsTrigger>
                        <TabsTrigger value="signup"><UserPlus className="mr-2"/> Registrarse</TabsTrigger>
                      </TabsList>
                      <TabsContent value="login" className="space-y-4 pt-4">
                        <form onSubmit={handleEmailPasswordSignIn} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="login-email">Correo</Label>
                                <Input id="login-email" type="email" placeholder="tu@correo.com" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="login-password">Contraseña</Label>
                                <Input id="login-password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                            </div>
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? 'Entrando...' : 'Entrar'}
                            </Button>
                        </form>
                      </TabsContent>
                      <TabsContent value="signup" className="space-y-4 pt-4">
                         <form onSubmit={handleEmailPasswordSignUp} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="signup-email">Correo</Label>
                                <Input id="signup-email" type="email" placeholder="tu@correo.com" value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-password">Contraseña</Label>
                                <Input id="signup-password" type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                            </div>
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
                            </Button>
                        </form>
                      </TabsContent>
                    </Tabs>
                </CardContent>
                 <CardFooter className="flex flex-col gap-4">
                    <p className="text-xs text-muted-foreground text-center">Crea una cuenta para comenzar tu viaje emocional.</p>
                </CardFooter>
            </Card>
        </div>
    );
}
