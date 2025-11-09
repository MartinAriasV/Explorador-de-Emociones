
"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { Emotion, GameProps, UserProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PREDEFINED_EMOTIONS } from '@/lib/constants';

interface EmotionalAscentGameProps {
    emotionsList: Emotion[];
    userProfile: UserProfile;
    onGameEnd: (score: number) => void;
}

interface Platform {
    id: number;
    x: number;
    y: number;
    type: 'normal' | 'brittle' | 'boost';
    emotion?: Emotion;
    isBreaking?: boolean;
}

const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 40;
const PLATFORM_WIDTH = 80;
const PLATFORM_HEIGHT = 20;
const GRAVITY = 0.35;
const JUMP_FORCE = -10;
const BOOST_JUMP_FORCE = -18;
const MAX_FALL_SPEED = 10;
const HORIZONTAL_SPEED = 5;

const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

export function EmotionalAscentGame({ emotionsList, userProfile, onGameEnd }: EmotionalAscentGameProps) {
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const [gameState, setGameState] = useState<'start' | 'playing' | 'gameOver'>('start');

    const [playerPos, setPlayerPos] = useState({ x: 230, y: 350 });
    const [playerVel, setPlayerVel] = useState({ x: 0, y: 0 });
    const [platforms, setPlatforms] = useState<Platform[]>([]);
    const [score, setScore] = useState(0);

    const keysRef = useRef<{ [key: string]: boolean }>({});
    const animationFrameIdRef = useRef<number>();
    
    const allEmotions = useMemo(() => {
        const emotionMap = new Map<string, Emotion>();
        PREDEFINED_EMOTIONS.forEach(p => emotionMap.set(p.name.toLowerCase(), { ...p, id: p.name, isCustom: false } as Emotion));
        emotionsList.forEach(e => emotionMap.set(e.name.toLowerCase(), e));
        return Array.from(emotionMap.values());
    }, [emotionsList]);
    
    const getEmotion = (name: string): Emotion | undefined => {
        return allEmotions.find(e => e.name.toLowerCase() === name.toLowerCase());
    }

    const generateNewPlatform = (y: number, gameWidth: number) => {
        const rand = Math.random();
        let type: Platform['type'] = 'normal';
        let emotion: Emotion | undefined;

        if (rand < 0.1) {
            type = 'boost';
            emotion = getEmotion('Alegría') || getEmotion('Motivación');
        } else if (rand < 0.3) {
            type = 'brittle';
            emotion = getEmotion('Ansiedad') || getEmotion('Frustración');
        }

        return {
            id: Date.now() + Math.random(),
            x: Math.random() * (gameWidth - PLATFORM_WIDTH),
            y: y,
            type: type,
            emotion: emotion
        };
    };
    
    const resetGame = useCallback(() => {
        const gameWidth = gameAreaRef.current?.clientWidth || 500;
        const gameHeight = gameAreaRef.current?.clientHeight || 400;

        const initialPlayerX = gameWidth / 2 - PLAYER_WIDTH / 2;
        const initialPlayerY = gameHeight - PLAYER_HEIGHT * 3;

        setPlayerPos({ x: initialPlayerX, y: initialPlayerY });
        setPlayerVel({ x: 0, y: 0 });
        setScore(0);

        let initialPlatforms: Platform[] = [];
        // Solid base to start on
        initialPlatforms.push({
            id: Date.now(),
            x: initialPlayerX - (PLATFORM_WIDTH - PLAYER_WIDTH) / 2,
            y: initialPlayerY + PLAYER_HEIGHT,
            type: 'normal'
        });
        
        // Generate starting platforms
        for (let i = 1; i < 10; i++) {
            const newY = gameHeight - (i * 80);
            initialPlatforms.push(generateNewPlatform(newY, gameWidth));
        }

        setPlatforms(initialPlatforms);
        setGameState('playing');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => { keysRef.current[e.key] = true; };
        const handleKeyUp = (e: KeyboardEvent) => { keysRef.current[e.key] = false; };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        const gameLoop = () => {
            if (gameState !== 'playing') {
                if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
                return;
            }

            setPlayerPos(prevPos => {
                let newVelX = 0;
                if (keysRef.current['ArrowLeft']) newVelX = -HORIZONTAL_SPEED;
                if (keysRef.current['ArrowRight']) newVelX = HORIZONTAL_SPEED;
                
                let newPosX = prevPos.x + newVelX;
                const gameWidth = gameAreaRef.current?.clientWidth || 500;
                const gameHeight = gameAreaRef.current?.clientHeight || 400;

                // Screen wrapping
                if (newPosX > gameWidth) newPosX = -PLAYER_WIDTH;
                if (newPosX < -PLAYER_WIDTH) newPosX = gameWidth;
                
                let newPosY = prevPos.y;
                let newVelY = Math.min(playerVel.y + GRAVITY, MAX_FALL_SPEED);

                // Platform Collision
                if (newVelY > 0) { // Only check for collision when falling
                    platforms.forEach(p => {
                        if (
                            newPosX < p.x + PLATFORM_WIDTH &&
                            newPosX + PLAYER_WIDTH > p.x &&
                            prevPos.y + PLAYER_HEIGHT <= p.y &&
                            prevPos.y + PLAYER_HEIGHT + newVelY >= p.y
                        ) {
                            newPosY = p.y - PLAYER_HEIGHT;
                            newVelY = p.type === 'boost' ? BOOST_JUMP_FORCE : JUMP_FORCE;
                            if (p.type === 'brittle' && !p.isBreaking) {
                                p.isBreaking = true;
                                setTimeout(() => {
                                    setPlatforms(prev => prev.filter(plat => plat.id !== p.id));
                                }, 300);
                            }
                        }
                    });
                }
                
                newPosY += newVelY;

                let scrollOffset = 0;
                if (newPosY < gameHeight / 2) {
                    scrollOffset = (gameHeight / 2) - newPosY;
                    newPosY = gameHeight / 2;
                    setScore(s => s + Math.round(scrollOffset));
                }

                setPlatforms(prevPlats => {
                    const scrolledPlatforms = prevPlats
                        .map(p => ({ ...p, y: p.y + scrollOffset }))
                        .filter(p => p.y < gameHeight + 50);

                    if (scrolledPlatforms.length < 15) {
                        const highestPlatY = scrolledPlatforms.reduce((minY, p) => Math.min(minY, p.y), Infinity);
                        scrolledPlatforms.push(generateNewPlatform(highestPlatY - (80 + Math.random() * 20), gameWidth));
                    }
                    return scrolledPlatforms;
                });
                
                if (newPosY > gameHeight) {
                    setGameState('gameOver');
                }

                setPlayerVel({ x: newVelX, y: newVelY });
                return { x: newPosX, y: newPosY };
            });

            animationFrameIdRef.current = requestAnimationFrame(gameLoop);
        };

        if (gameState === 'playing') {
            animationFrameIdRef.current = requestAnimationFrame(gameLoop);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
        };
    }, [gameState, playerVel.y, platforms, resetGame]);

    useEffect(() => {
        if (gameState === 'gameOver' && score > 0) {
            onGameEnd(score);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState]);


    if (gameState === 'start') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <h2 className="text-2xl font-bold text-primary">Ascenso Emocional</h2>
                <p className="text-muted-foreground my-4 max-w-md">¡Salta tan alto como puedas! Usa las flechas del teclado para moverte. ¡Gana puntos por cada metro ascendido!</p>
                <Button onClick={resetGame} size="lg">
                    <Rocket className="mr-2" /> Empezar a Ascender
                </Button>
            </div>
        );
    }
    
    if (gameState === 'gameOver') {
        return (
            <Card className="w-full max-w-md mx-auto my-auto flex flex-col items-center justify-center text-center p-8 animate-fade-in">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">¡Juego Terminado!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <CardDescription>Tu Puntuación</CardDescription>
                        <p className="text-5xl font-bold text-primary">{score}</p>
                    </div>
                    <div className="space-y-1">
                        <CardDescription>Tu Récord</CardDescription>
                        <p className="text-3xl font-semibold text-muted-foreground">{userProfile.ascentHighScore || 0}</p>
                    </div>
                </CardContent>
                <Button onClick={resetGame} size="lg">
                    Jugar de Nuevo
                </Button>
            </Card>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
             <div className="w-full max-w-[500px] flex justify-center items-center text-2xl font-bold text-primary px-2">
                 <p>{score}</p>
             </div>
            <div ref={gameAreaRef} className="relative w-full max-w-[500px] h-[400px] bg-sky-100 dark:bg-sky-900/30 rounded-lg overflow-hidden border-2">
                {/* Player */}
                <div style={{ left: playerPos.x, top: playerPos.y, width: PLAYER_WIDTH, height: PLAYER_HEIGHT }} className="absolute text-4xl flex items-center justify-center transition-transform duration-75">
                    {userProfile.avatar}
                </div>

                {/* Platforms */}
                {platforms.map(p => (
                    <div key={p.id} style={{ left: p.x, top: p.y, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT }} className={cn(
                        "absolute flex items-center justify-center text-2xl rounded-md transition-opacity duration-300",
                        p.type === 'normal' && 'bg-white/80 dark:bg-slate-500/80',
                        p.type === 'boost' && 'bg-green-300/80 dark:bg-green-700/80',
                        p.type === 'brittle' && 'bg-orange-300/80 dark:bg-orange-700/80',
                        p.isBreaking ? 'opacity-0' : 'opacity-100'
                    )}>
                        {p.emotion && <span className="absolute text-3xl opacity-80">{p.emotion.icon}</span>}
                    </div>
                ))}
            </div>
        </div>
    );
}

    

    