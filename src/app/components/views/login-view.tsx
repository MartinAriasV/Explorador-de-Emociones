"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.254 44 30.028 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
);


export default function LoginView() {
    const { toast } = useToast();
    const { auth } = useFirebase();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleGoogleSignIn = async () => {
        setIsSubmitting(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            // The onAuthStateChanged listener will handle the redirect
        } catch (error: any) {
            console.error("Google Sign-In Error:", error);
            toast({
                variant: 'destructive',
                title: 'Error de inicio de sesión con Google',
                description: error.message || 'No se pudo iniciar sesión. Por favor, inténtalo de nuevo.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEmailPasswordSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
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
        } catch (error: any) {
             console.error("Sign-In Error:", error);
            toast({
                variant: 'destructive',
                title: 'Error al Iniciar Sesión',
                description: error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' ? 'Correo o contraseña incorrectos.' : (error.message || 'No se pudo iniciar sesión.'),
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
                   <Tabs defaultValue="login" className="w-full">
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

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">O continúa con</span>
                        </div>
                    </div>

                    <Button onClick={handleGoogleSignIn} disabled={isSubmitting} className="w-full" variant="outline">
                        <GoogleIcon />
                        {isSubmitting ? 'Conectando...' : 'Entrar con Google'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
