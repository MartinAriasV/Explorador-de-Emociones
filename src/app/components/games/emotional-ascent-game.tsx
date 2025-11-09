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

    const resetGame = useCallback(() => {
        const gameWidth = gameAreaRef.current?.clientWidth || 500;
        setPlayerPos({ x: gameWidth / 2 - PLAYER_WIDTH / 2, y: 350 });
        setPlayerVel({ x: 0, y: 0 });
        setScore(0);
        setHighestY(350);
        
        let initialPlatforms: Platform[] = [];
        for (let i = 0; i < 10; i++) {
            initialPlatforms.push({
                id: i,
                x: Math.random() * (gameWidth - PLATFORM_WIDTH),
                y: 400 - 80 * i,
                type: 'normal'
            });
        }
        setPlatforms(initialPlatforms);
        setGameState('playing');
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => { keysRef.current[e.key] = true; };
        const handleKeyUp = (e: KeyboardEvent) => { keysRef.current[e.key] = false; };

        let orientation = { gamma: 0 };
        const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
            orientation.gamma = e.gamma || 0;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', handleDeviceOrientation, true);
        }

        let animationFrameId: number;

        const gameLoop = () => {
            if (gameState !== 'playing') {
                cancelAnimationFrame(animationFrameId);
                return;
            }

            const gameWidth = gameAreaRef.current?.clientWidth || 500;
            const gameHeight = gameAreaRef.current?.clientHeight || 400;

            // ---- Player Horizontal Movement ----
            let newPlayerX = playerPos.x;
            const tilt = orientation.gamma / 90; // Normalize gamma
            if (Math.abs(tilt) > 0.1) {
                newPlayerX += HORIZONTAL_SPEED * tilt * 2;
            } else {
                 if (keysRef.current['ArrowLeft']) newPlayerX -= HORIZONTAL_SPEED;
                 if (keysRef.current['ArrowRight']) newPlayerX += HORIZONTAL_SPEED;
            }

            // Boundary checks for player X
            if (newPlayerX < 0) newPlayerX = 0;
            if (newPlayerX > gameWidth - PLAYER_WIDTH) newPlayerX = gameWidth - PLAYER_WIDTH;

            // ---- Player Vertical Movement & Gravity ----
            let newPlayerY = playerPos.y;
            let newPlayerVelY = playerVel.y + GRAVITY;
            newPlayerVelY = Math.min(newPlayerVelY, MAX_FALL_SPEED);
            newPlayerY += newPlayerVelY;

            // ---- Camera scroll ----
            let screenShift = 0;
            if (newPlayerY < gameHeight / 2 && newPlayerVelY < 0) {
                screenShift = -newPlayerVelY;
                newPlayerY = gameHeight / 2;
            }
            
            setPlayerPos({ x: newPlayerX, y: newPlayerY });
            setPlayerVel(prev => ({ ...prev, y: newPlayerVelY }));

            // ---- Platform logic ----
            let newPlatforms = platforms.map(p => ({ ...p, y: p.y + screenShift }));

            if (newPlayerVelY > 0) { // Only check for collision when falling
                newPlatforms.forEach((platform) => {
                    if (
                        newPlayerX < platform.x + PLATFORM_WIDTH &&
                        newPlayerX + PLAYER_WIDTH > platform.x &&
                        newPlayerY + PLAYER_HEIGHT > platform.y &&
                        newPlayerY + PLAYER_HEIGHT < platform.y + PLATFORM_HEIGHT + playerVel.y
                    ) {
                        if (platform.type === 'boost') {
                            setPlayerVel({ x: 0, y: BOOST_JUMP_FORCE });
                        } else {
                            setPlayerVel({ x: 0, y: JUMP_FORCE });
                        }

                        if (platform.type === 'brittle' && !platform.isBreaking) {
                            platform.isBreaking = true;
                            setTimeout(() => {
                                setPlatforms(prev => prev.filter(p => p.id !== platform.id));
                            }, 300);
                        }
                    }
                });
            }

            // ---- Remove old platforms and add new ones ----
            newPlatforms = newPlatforms.filter(p => p.y < gameHeight);
            
            const lowestPlatform = newPlatforms.reduce((prev, curr) => (prev.y < curr.y ? prev : curr), {y: 0});
            if (lowestPlatform.y > -PLATFORM_HEIGHT) {
                const newPlatformY = lowestPlatform.y - (50 + Math.random() * 50);
                const rand = Math.random();
                let type: Platform['type'] = 'normal';
                let emotion: Emotion | undefined = undefined;

                if (rand < 0.1 && emotionsList.length > 0) {
                    type = 'boost';
                    emotion = shuffleArray(emotionsList.filter(e => ['Alegría', 'Motivación'].includes(e.name)))[0];
                } else if (rand < 0.3 && emotionsList.length > 0) {
                    type = 'brittle';
                    emotion = shuffleArray(emotionsList.filter(e => ['Frustración', 'Ansiedad'].includes(e.name)))[0];
                }

                newPlatforms.push({
                    id: Date.now(),
                    x: Math.random() * (gameWidth - PLATFORM_WIDTH),
                    y: newPlatformY,
                    type: type,
                    emotion: emotion
                });
            }

            setPlatforms(newPlatforms);

            // ---- Score update ----
            if (playerPos.y < highestY) {
                setScore(s => s + Math.floor(highestY - playerPos.y));
                setHighestY(playerPos.y);
            }

            // ---- Game Over Check ----
            if (playerPos.y > gameHeight) {
                setGameState('gameOver');
                onGameEnd(score);
            }

            animationFrameId = requestAnimationFrame(gameLoop);
        };

        if (gameState === 'playing') {
            animationFrameId = requestAnimationFrame(gameLoop);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('deviceorientation', handleDeviceOrientation);
        };
    }, [gameState, playerPos, playerVel, platforms, highestY, score, onGameEnd, emotionsList]);

    if (gameState === 'start') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <h2 className="text-2xl font-bold text-primary">Ascenso Emocional</h2>
                <p className="text-muted-foreground my-4 max-w-md">¡Salta tan alto como puedas! Usa las flechas del teclado o inclina tu dispositivo para moverte. ¡Gana puntos por cada metro ascendido!</p>
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
            <div ref={gameAreaRef} className="relative w-full max-w-[500px] h-[400px] bg-muted/20 rounded-lg overflow-hidden border-2">
                {/* Player */}
                <div style={{ left: playerPos.x, top: playerPos.y, width: PLAYER_WIDTH, height: PLAYER_HEIGHT }} className="absolute text-4xl flex items-center justify-center">
                    {userProfile.avatar}
                </div>

                {/* Platforms */}
                {platforms.map(p => (
                    <div key={p.id} style={{ left: p.x, top: p.y, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT }} className={cn(
                        "absolute flex items-center justify-center text-2xl transition-all duration-300",
                        p.isBreaking ? 'opacity-0 scale-50' : 'opacity-100'
                    )}>
                        ☁️
                        {p.emotion && <span className="absolute text-3xl opacity-80">{p.emotion.icon}</span>}
                    </div>
                ))}
            </div>
        </div>
    );
}