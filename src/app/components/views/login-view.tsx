"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFirebase } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export default function LoginView() {
    const { auth } = useFirebase();
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: error.message || "Could not sign in with Google.",
            });
        }
    };

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSigningIn(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            // If sign-in fails, try to sign up
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                try {
                    await createUserWithEmailAndPassword(auth, email, password);
                } catch (signUpError: any) {
                    toast({
                        variant: "destructive",
                        title: "Uh oh! Something went wrong.",
                        description: signUpError.message || "Could not create an account.",
                    });
                }
            } else {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: error.message || "Could not sign in.",
                });
            }
        } finally {
            setIsSigningIn(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-background">
            <Card className="w-full max-w-sm mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-primary">Emotion Explorer</CardTitle>
                    <CardDescription>Inicia sesión para continuar</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Button onClick={handleGoogleSignIn} variant="outline" className="w-full">
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" role="img" aria-label="Google logo">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.42-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6.02C42.47 39.01 47 32.25 47 24.55z"></path>
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6.02c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                <path fill="none" d="M0 0h48v48H0z"></path>
                            </svg>
                            Sign in with Google
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleEmailSignIn}>
                            <div className="space-y-2">
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
                                </div>
                                <div>
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
                                </div>
                            </div>
                            <Button type="submit" disabled={isSigningIn} className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
                                {isSigningIn ? 'Signing In...' : 'Sign In with Email'}
                            </Button>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
