"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatWithPet } from '@/ai/flows/chat-with-pet';
import type { SpiritAnimal, View, DiaryEntry, Emotion, UserProfile } from '@/lib/types';
import type { User } from 'firebase/auth';
import { ArrowLeft, Send, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SHOP_ITEMS } from '@/lib/constants';

interface PetChatViewProps {
  pet: SpiritAnimal | null;
  user: User;
  setView: (view: View) => void;
  diaryEntries: DiaryEntry[];
  emotionsList: Emotion[];
  userProfile: UserProfile;
}

interface Message {
  text: string;
  sender: 'user' | 'pet';
}

const getEmotionById = (id: string, emotionsList: Emotion[]) => emotionsList.find(e => e.id === id);

export function PetChatView({ pet, user, setView, diaryEntries, emotionsList, userProfile }: PetChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initialContext, setInitialContext] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const backgroundItem = userProfile.activeRoomBackgroundId
    ? SHOP_ITEMS.find(item => item.id === userProfile.activeRoomBackgroundId)
    : null;

  const backgroundStyle = backgroundItem && backgroundItem.imageUrl
    ? { backgroundImage: `url(${backgroundItem.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor: '#F0FDF4' };

  const accessoryItems = userProfile.purchasedItemIds
    ? SHOP_ITEMS.filter(item => 
        userProfile.purchasedItemIds.includes(item.id) && 
        (item.type === 'pet_accessory')
      )
    : [];

  useEffect(() => {
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

      const recentEntries = [...diaryEntries].reverse().slice(0, 3);
      if (recentEntries.length > 0) {
        const contextStr = "Contexto de sentimientos recientes: " + recentEntries.map((entry, index) => {
          const emotion = getEmotionById(entry.emotionId, emotionsList);
          return `${index + 1}. ${emotion?.name || 'desconocida'}: "${entry.text}"`;
        }).join(' ');
        setInitialContext(contextStr);
      } else {
        setInitialContext("El usuario aún no ha escrito en su diario.");
      }
    }
  }, [pet, diaryEntries, emotionsList]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !pet || !initialContext) return;

    const userMessage: Message = { text: inputValue, sender: 'user' };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);
    const history = newMessages.slice(0, -1).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model' as 'user' | 'model',
      content: [{ text: msg.text }],
    }));
    try {
      const response = await chatWithPet({
        userId: user.uid,
        message: inputValue,
        petName: pet.name,
        recentFeelingsContext: initialContext,
        history: history,
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
        <Button onClick={() => setView('collection')} className="mt-4">Ir a mi Colección</Button>
      </div>
    );
  }

  return (
    <Card className="w-full h-full shadow-lg flex flex-col max-w-4xl mx-auto rounded-lg">
      <CardHeader className="flex flex-row items-center gap-4 p-4 md:p-6 pb-4">
        <Button variant="ghost" size="icon" onClick={() => setView('sanctuary')}>
          <ArrowLeft />
        </Button>
        <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center text-4xl shadow-inner">
          {pet.icon}
        </div>
        <div>
          <CardTitle className="text-2xl font-bold text-primary">{pet.name}</CardTitle>
          <p className="text-sm text-muted-foreground">Tu compañero IA activo</p>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-0 flex flex-col min-h-0">
        <div className="h-1/2 w-full relative rounded-t-lg border m-4 mb-0" style={backgroundStyle}>
          {accessoryItems.map((item, index) => item.imageUrl && (
            <img
              key={item.id}
              src={item.imageUrl}
              alt={item.name}
              className="w-16 h-16 absolute"
              style={{ top: `${60 + (index % 2 * 10)}%`, left: `${20 + index * 20}%` }}
            />
          ))}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-24 h-24 rounded-full bg-card/80 dark:bg-card flex items-center justify-center text-6xl shadow-lg border-4 border-white dark:border-gray-800">
                {pet.icon}
            </div>
          </div>
        </div>
        <div className="h-1/2 flex flex-col p-4 pt-2">
           <ScrollArea className="flex-grow h-full" ref={scrollAreaRef}>
              <div className="p-4 space-y-4">
                  {initialContext && messages.length <= 1 && (
                  <div className="flex items-start gap-3 text-sm text-muted-foreground bg-card/80 dark:bg-card/60 p-3 rounded-lg animate-fade-in backdrop-blur-sm">
                      <Info className="h-5 w-5 mt-0.5 shrink-0" />
                      <p>Para esta charla, estoy recordando que últimamente te has sentido: {initialContext.replace('Contexto de sentimientos recientes: ', '').split('. ').slice(0, 3).join(', ')}</p>
                  </div>
                  )}
                  {messages.map((msg, index) => (
                  <div key={index} className={cn("flex items-end gap-2", msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
                      {msg.sender === 'pet' && (
                          <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center text-xl shadow border-2">
                          {pet.icon}
                          </div>
                      )}
                      <div className={cn(
                          "p-3 rounded-lg max-w-xs md:max-w-md lg:max-w-lg shadow",
                          msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'
                      )}>
                          <p>{msg.text}</p>
                      </div>
                  </div>
                  ))}
                  {isLoading && (
                      <div className="flex items-end gap-2 justify-start">
                      <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center text-xl shadow border-2">
                          {pet.icon}
                      </div>
                      <div className="p-3 rounded-lg bg-card shadow">
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
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="flex w-full items-center space-x-2"
        >
            <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Escribe un mensaje a ${pet.name}...`}
                disabled={isLoading}
                className="bg-card/90 backdrop-blur-sm"
            />
            <Button type="submit" disabled={isLoading || !inputValue.trim()}>
                <Send className="h-4 w-4"/>
            </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
