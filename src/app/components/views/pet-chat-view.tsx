"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatWithPet } from '@/ai/flows/chat-with-pet';
import type { SpiritAnimal, View, DiaryEntry, Emotion } from '@/lib/types';
import type { User } from 'firebase/auth';
import { ArrowLeft, Send, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PetChatViewProps {
  pet: SpiritAnimal | null;
  user: User;
  setView: (view: View) => void;
  diaryEntries: DiaryEntry[];
  emotionsList: Emotion[];
}

interface Message {
  text: string;
  sender: 'user' | 'pet';
}

const getEmotionById = (id: string, emotionsList: Emotion[]) => emotionsList.find(e => e.id === id);

const getRecentFeelingsContext = (diaryEntries: DiaryEntry[], emotionsList: Emotion[]) => {
    const recentEntries = [...diaryEntries].reverse().slice(0, 3);
    if (recentEntries.length === 0) {
      return {
          contextString: "El usuario aún no ha escrito en su diario.",
          displayFeelings: []
      };
    }
    
    const contextString = "Contexto de sentimientos recientes: " + recentEntries.map((entry, index) => {
        const emotion = getEmotionById(entry.emotionId, emotionsList);
        return `${index + 1}. Emoción: ${emotion?.name || 'desconocida'}, Pensamiento: "${entry.text}"`;
      }).join(' ');

    const displayFeelings = recentEntries.map(entry => getEmotionById(entry.emotionId, emotionsList)).filter(Boolean) as Emotion[];

    return { contextString, displayFeelings };
};

export function PetChatView({ pet, user, setView, diaryEntries, emotionsList }: PetChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initialContext, setInitialContext] = useState<{ contextString: string; displayFeelings: Emotion[] } | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the chat on new messages
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  useEffect(() => {
    if (pet) {
        setMessages([
            { text: `¡Hola! Soy ${pet.name}. ¿Cómo estás hoy?`, sender: 'pet' }
        ]);
        const context = getRecentFeelingsContext(diaryEntries, emotionsList);
        setInitialContext(context);
    }
  }, [pet, diaryEntries, emotionsList]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !pet || !initialContext) return;

    const userMessage: Message = { text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatWithPet({
        userId: user.uid,
        message: inputValue,
        petName: pet.name,
        recentFeelingsContext: initialContext.contextString,
      });

      const petMessage: Message = { text: response.response, sender: 'pet' };
      setMessages(prev => [...prev, petMessage]);
    } catch (error) {
      console.error("Error chatting with pet:", error);
      const errorMessage: Message = { text: "Uhm... no sé qué decir. Inténtalo de nuevo.", sender: 'pet' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!pet) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-lg bg-muted/50">
            <p className="text-lg font-semibold">No has seleccionado ninguna mascota.</p>
            <Button onClick={() => setView('sanctuary')} className="mt-4">
                Ir al Santuario
            </Button>
      </div>
    )
  }

  return (
    <Card className="w-full h-full shadow-lg flex flex-col max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setView('sanctuary')}>
            <ArrowLeft />
        </Button>
        <span className="text-5xl">{pet.icon}</span>
        <div>
            <CardTitle className="text-2xl font-bold text-primary">{pet.name}</CardTitle>
            <p className="text-sm text-muted-foreground">Tu compañero IA</p>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={cn("flex items-end gap-2", msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
                        {msg.sender === 'pet' && <span className="text-3xl">{pet.icon}</span>}
                        <div className={cn(
                            "p-3 rounded-lg max-w-xs md:max-w-md lg:max-w-lg",
                             msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        )}>
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
                 {initialContext && initialContext.displayFeelings.length > 0 && messages.length === 1 && (
                  <div className="flex items-start gap-3 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg animate-fade-in">
                    <Info className="h-5 w-5 mt-0.5 shrink-0" />
                    <p>Para esta charla, estoy recordando que últimamente te has sentido: {initialContext.displayFeelings.map(e => e.name).join(', ')}.</p>
                  </div>
                )}
                {isLoading && (
                     <div className="flex items-end gap-2 justify-start">
                        <span className="text-3xl">{pet.icon}</span>
                        <div className="p-3 rounded-lg bg-muted">
                           <div className="flex items-center gap-1.5">
                               <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]"></span>
                               <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]"></span>
                               <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"></span>
                           </div>
                        </div>
                    </div>
                )}
            </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="flex w-full items-center space-x-2"
        >
            <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Escribe un mensaje a ${pet.name}...`}
                disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !inputValue.trim()}>
                <Send className="h-4 w-4"/>
                <span className="sr-only">Enviar</span>
            </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
