"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Emotion, GameProps, UserProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

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
const GRAVITY = 0.3;
const JUMP_FORCE = -10;
const BOOST_JUMP_FORCE = -20;
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
    const [highestY, setHighestY] = useState(playerPos.y);

    const keysRef = useRef<{ [key: string]: boolean }>({});
    const scoreSubmittedRef = useRef(false);
    const animationFrameIdRef = useRef<number>();

    const resetGame = useCallback(() => {
        scoreSubmittedRef.current = false;
        const gameWidth = gameAreaRef.current?.clientWidth || 500;
        const gameHeight = gameAreaRef.current?.clientHeight || 400;

        const initialPlayerX = gameWidth / 2 - PLAYER_WIDTH / 2;
        const initialPlayerY = gameHeight - PLAYER_HEIGHT * 3;

        setPlayerPos({ x: initialPlayerX, y: initialPlayerY });
        setPlayerVel({ x: 0, y: 0 });
        setScore(0);
        setHighestY(initialPlayerY);

        let initialPlatforms: Platform[] = [];
        initialPlatforms.push({
            id: Date.now(),
            x: initialPlayerX - (PLATFORM_WIDTH - PLAYER_WIDTH) / 2,
            y: initialPlayerY + PLAYER_HEIGHT,
            type: 'normal'
        });

        for (let i = 1; i < 10; i++) {
            initialPlatforms.push({
                id: Date.now() + i,
                x: Math.random() * (gameWidth - PLATFORM_WIDTH),
                y: initialPlatforms[i-1].y - (60 + Math.random() * 20),
                type: 'normal'
            });
        }
        setPlatforms(initialPlatforms);
        setGameState('playing');
    }, []);

    useEffect(() => {
        if (gameState === 'gameOver' && !scoreSubmittedRef.current) {
            onGameEnd(score);
            scoreSubmittedRef.current = true;
        }
    }, [gameState, onGameEnd, score]);

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
                let newVelY = playerVel.y + GRAVITY;
                newVelY = Math.min(newVelY, MAX_FALL_SPEED);

                let newX = prevPos.x;
                if (keysRef.current['ArrowLeft']) newX -= HORIZONTAL_SPEED;
                if (keysRef.current['ArrowRight']) newX += HORIZONTAL_SPEED;

                const gameWidth = gameAreaRef.current?.clientWidth || 500;
                newX = Math.max(0, Math.min(newX, gameWidth - PLAYER_WIDTH));
                
                let newY = prevPos.y + newVelY;
                let scrollOffset = 0;
                const gameHeight = gameAreaRef.current?.clientHeight || 400;

                if (newY < gameHeight / 2) {
                    scrollOffset = gameHeight / 2 - newY;
                    newY = gameHeight / 2;
                }

                setPlatforms(prevPlats => {
                    let newPlatforms = prevPlats.map(p => ({ ...p, y: p.y + scrollOffset }));
                    
                    if (newVelY > 0) { // Check collision only when falling
                        newPlatforms.forEach(p => {
                            if (
                                newX < p.x + PLATFORM_WIDTH &&
                                newX + PLAYER_WIDTH > p.x &&
                                prevPos.y + PLAYER_HEIGHT <= p.y &&
                                newY + PLAYER_HEIGHT >= p.y
                            ) {
                                newVelY = p.type === 'boost' ? BOOST_JUMP_FORCE : JUMP_FORCE;
                                if (p.type === 'brittle' && !p.isBreaking) {
                                    p.isBreaking = true;
                                    setTimeout(() => {
                                        setPlatforms(currentPlatforms => currentPlatforms.filter(plat => plat.id !== p.id));
                                    }, 300);
                                }
                            }
                        });
                    }

                    // Remove old platforms, add new ones
                    const highestPlat = newPlatforms.reduce((prev, curr) => (curr.y < prev.y ? curr : prev), { y: Infinity });
                    
                    if (highestPlat.y > -PLATFORM_HEIGHT) {
                        const newPlatY = highestPlat.y - (60 + Math.random() * 40);
                        const rand = Math.random();
                        let type: Platform['type'] = 'normal';
                        if (rand < 0.1) type = 'boost';
                        else if (rand < 0.3) type = 'brittle';
                        
                        newPlatforms.push({
                            id: Date.now(),
                            x: Math.random() * (gameWidth - PLATFORM_WIDTH),
                            y: newPlatY,
                            type: type
                        });
                    }

                    return newPlatforms.filter(p => p.y < gameHeight);
                });

                setPlayerVel({ x: 0, y: newVelY });
                
                if (scrollOffset > 0) {
                    setScore(s => s + Math.round(scrollOffset));
                }
                
                if (newY > gameHeight) {
                    setGameState('gameOver');
                }

                return { x: newX, y: newY };
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
                <div style={{ left: playerPos.x, top: playerPos.y, width: PLAYER_WIDTH, height: PLAYER_HEIGHT }} className="absolute text-4xl flex items-center justify-center">
                    {userProfile.avatar}
                </div>

                {/* Platforms */}
                {platforms.map(p => (
                    <div key={p.id} style={{ left: p.x, top: p.y, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT }} className={cn(
                        "absolute flex items-center justify-center text-2xl rounded-md transition-all duration-300",
                        p.type === 'normal' && 'bg-white/80 dark:bg-slate-500/80',
                        p.type === 'boost' && 'bg-green-300/80 dark:bg-green-700/80',
                        p.type === 'brittle' && 'bg-orange-300/80 dark:bg-orange-700/80',
                        p.isBreaking ? 'opacity-0 scale-50' : 'opacity-100'
                    )}>
                        {p.emotion && <span className="absolute text-3xl opacity-80">{p.emotion.icon}</span>}
                    </div>
                ))}
            </div>
        </div>
    );
}