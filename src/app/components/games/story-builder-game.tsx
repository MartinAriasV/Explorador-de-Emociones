"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { Emotion, GameProps, SpiritAnimal } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { BookMarked, Brain, Loader, Send, Sparkles } from 'lucide-react';
import { SPIRIT_ANIMALS } from '@/lib/constants';
import { chatWithPet } from '@/ai/flows/chat-with-pet';
import type { User } from 'firebase/auth';

const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

interface StoryBuilderGameProps extends GameProps {
    addPoints: (amount: number) => void;
    user: User;
}

type GameStep = 'start' | 'pick-emotion' | 'write-reason' | 'show-story' | 'loading';

export function StoryBuilderGame({ emotionsList, addPoints, user }: StoryBuilderGameProps) {
    const [step, setStep] = useState<GameStep>('start');
    const [protagonist, setProtagonist] = useState<SpiritAnimal | null>(null);
    const [emotionOptions, setEmotionOptions] = useState<Emotion[]>([]);
    const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
    const [reason, setReason] = useState('');
    const [finalStory, setFinalStory] = useState('');

    const wiseFriend = useMemo(() => SPIRIT_ANIMALS.find(a => a.id === 'wise-owl'), []);

    const startGame = () => {
        const availableProtagonists = SPIRIT_ANIMALS.filter(a => a.id !== 'wise-owl');
        setProtagonist(shuffleArray(availableProtagonists)[0]);
        setEmotionOptions(shuffleArray(emotionsList).slice(0, 4));
        setSelectedEmotion(null);
        setReason('');
        setFinalStory('');
        setStep('pick-emotion');
    };

    const handleEmotionSelect = (emotion: Emotion) => {
        setSelectedEmotion(emotion);
        setStep('write-reason');
    };

    const handleReasonSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason.trim() || !protagonist || !selectedEmotion || !wiseFriend) return;
        setStep('loading');

        const storyPrompt = `Genial, ¡terminemos la historia! ${protagonist.name} se siente ${selectedEmotion.name.toLowerCase()} porque ${reason}. ¿Cómo le ayudó su amigo el ${wiseFriend.name} a sentirse mejor?`;

        try {
            const result = await chatWithPet({
                userId: user.uid,
                message: storyPrompt,
                petName: wiseFriend.name, // The owl is the one responding
                history: [],
            });
            setFinalStory(result.response);
            addPoints(15);
        } catch (error) {
            console.error("Error generating story ending:", error);
            setFinalStory("El Búho Sabio está descansando y no pudo terminar la historia. ¡Inténtalo de nuevo!");
        } finally {
            setStep('show-story');
        }
    };
    
    if (emotionsList.length < 4) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-lg bg-muted/50">
                <p className="text-lg font-semibold">¡Faltan Emociones!</p>
                <p>Necesitas al menos 4 emociones diferentes para jugar a este juego.</p>
            </div>
        );
    }


    if (step === 'start') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <h2 className="text-2xl font-bold text-primary">Constructor de Historias</h2>
                <p className="text-muted-foreground my-4 max-w-md">¡Usa tu imaginación y la ayuda de un amigo sabio para crear una historia única!</p>
                <Button onClick={startGame} size="lg">
                    <BookMarked className="mr-2" />
                    Empezar una Historia
                </Button>
            </div>
        );
    }

    if (step === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in">
                 <Loader className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg font-semibold text-muted-foreground">El Búho Sabio está pensando en un buen final...</p>
            </div>
        );
    }
    
    if (step === 'show-story') {
        return (
             <Card className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center p-8 animate-fade-in">
                <CardHeader>
                    <Sparkles className="h-12 w-12 text-amber-400 mx-auto mb-4"/>
                    <CardTitle className="text-2xl font-bold">¡Tu Historia Está Completa!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <p className="text-lg">
                        <span className="text-5xl">{protagonist?.icon}</span> {protagonist?.name} se sentía <span className="font-bold" style={{color: selectedEmotion?.color}}>{selectedEmotion?.name.toLowerCase()}</span> porque {reason}.
                    </p>
                    <p className="text-lg text-primary font-semibold">
                       <span className="text-5xl">{wiseFriend?.icon}</span> {finalStory}
                    </p>
                </CardContent>
                 <Button onClick={startGame} className="mt-6">
                    <BookMarked className="mr-2" />
                    Crear Otra Historia
                </Button>
            </Card>
        )
    }

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 animate-fade-in">
            {step === 'pick-emotion' && protagonist && (
                <Card className="text-center p-8">
                    <span className="text-7xl">{protagonist.icon}</span>
                    <h2 className="text-2xl font-bold mt-4">
                        {protagonist.name} se siente...
                    </h2>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        {emotionOptions.map(emotion => (
                            <Button
                                key={emotion.id}
                                variant="outline"
                                className="h-auto py-4 text-base flex items-center gap-2"
                                onClick={() => handleEmotionSelect(emotion)}
                            >
                                <span className="text-3xl">{emotion.icon}</span> {emotion.name}
                            </Button>
                        ))}
                    </div>
                </Card>
            )}

            {step === 'write-reason' && protagonist && selectedEmotion && (
                 <Card className="text-center p-8">
                    <h2 className="text-2xl font-bold mt-4">
                        <span className="text-5xl">{protagonist.icon}</span> se siente <span style={{color: selectedEmotion.color}}>{selectedEmotion.name.toLowerCase()}</span> porque...
                    </h2>
                     <form onSubmit={handleReasonSubmit} className="flex flex-col gap-4 mt-6">
                        <Input 
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            placeholder="...perdió su juguete favorito."
                            className="text-center text-lg h-12"
                            autoFocus
                        />
                        <Button type="submit" disabled={!reason.trim()}>
                            <Send className="mr-2"/>
                            Siguiente
                        </Button>
                     </form>
                </Card>
            )}
        </div>
    );
}