
'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatWithPet } from '@/ai/flows/chat-with-pet';
import type {
  SpiritAnimal,
  View,
  DiaryEntry,
  Emotion,
  UserProfile,
  ShopItem,
} from '@/lib/types';
import type { User } from 'firebase/auth';
import { ArrowLeft, Send, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDoc, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { SHOP_ITEMS } from '@/lib/constants';

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

function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
}


interface DraggableItemProps {
    item: ShopItem;
    initialPosition: { x: number; y: number };
    onPositionChange: (itemId: string, pos: { x: number; y: number }) => void;
    containerRef: React.RefObject<HTMLDivElement>;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item, initialPosition, onPositionChange, containerRef }) => {
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        // Calculate the offset from the element's top-left corner to the mouse click point
        dragOffset.current = {
            x: e.clientX - e.currentTarget.getBoundingClientRect().left,
            y: e.clientY - e.currentTarget.getBoundingClientRect().top,
        };
        e.preventDefault();
        e.stopPropagation();
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !containerRef.current) return;
        
        const containerRect = containerRef.current.getBoundingClientRect();
        
        // Calculate new position based on mouse position relative to the container, adjusted by the initial click offset
        let newX = e.clientX - containerRect.left - dragOffset.current.x;
        let newY = e.clientY - containerRect.top - dragOffset.current.y;

        const itemWidth = 64; 
        const itemHeight = 64;
        
        // Constrain the new position within the container's bounds
        newX = Math.max(0, Math.min(newX, containerRect.width - itemWidth));
        newY = Math.max(0, Math.min(newY, containerRect.height - itemHeight));

        setPosition({ x: newX, y: newY });
    }, [isDragging, containerRef]);

    const handleMouseUp = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false);
        // Final position update is sent via `position` state change in the useEffect below
    }, [isDragging]);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    // When dragging stops, call onPositionChange with the final position
    useEffect(() => {
        if (!isDragging) {
            onPositionChange(item.id, position);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDragging]);
    
    // Update local position if initialPosition prop changes from outside
    useEffect(() => {
        setPosition(initialPosition);
    }, [initialPosition]);

    return (
        <div
            className="absolute text-5xl z-10 cursor-grab"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: isDragging ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.1s ease-in-out',
                width: '64px',
                height: '64px',
            }}
            onMouseDown={handleMouseDown}
        >
            {item.icon}
        </div>
    );
};


const getEmotionById = (id: string, emotionsList: Emotion[]) =>
  emotionsList.find((e) => e.id === id);

const getRecentFeelingsContext = (
  diaryEntries: DiaryEntry[],
  emotionsList: Emotion[]
) => {
  const recentEntries = [...diaryEntries].reverse().slice(0, 3);
  if (recentEntries.length === 0) {
    return {
      contextString: 'El usuario aún no ha escrito en su diario.',
      displayFeelings: [],
    };
  }

  const contextString =
    'Contexto de sentimientos recientes: ' +
    recentEntries
      .map((entry, index) => {
        const emotion = getEmotionById(entry.emotionId, emotionsList);
        return `${index + 1}. Emoción: ${
          emotion?.name || 'desconocida'
        }, Pensamiento: "${entry.text}"`;
      })
      .join(' ');

  const displayFeelings = recentEntries
    .map((entry) => getEmotionById(entry.emotionId, emotionsList))
    .filter(Boolean) as Emotion[];

  return { contextString, displayFeelings };
};

const backgroundStyles: { [key: string]: React.CSSProperties } = {
    'living-room': {
        backgroundColor: '#f0e6dd',
        backgroundImage: 'linear-gradient(to right, #e3d5c5 1px, transparent 1px), linear-gradient(to bottom, #e3d5c5 1px, transparent 1px), radial-gradient(circle at 10% 20%, rgba(255, 235, 205, 0.4) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(210, 180, 140, 0.4) 0%, transparent 40%)',
        backgroundSize: '50px 50px, 50px 50px, 200px 200px, 300px 300px',
    },
    'garden': {
        backgroundColor: '#e6f0e6',
        backgroundImage: 'radial-gradient(circle at 100% 0, #d4edda 0%, #e6f0e6 40%)',
    },
    'bedroom': {
        backgroundColor: '#1a202c',
        backgroundImage: 'radial-gradient(circle at 10px 10px, rgba(255, 255, 255, 0.1) 1px, transparent 1px), radial-gradient(circle at 50px 50px, rgba(255, 255, 255, 0.08) 1px, transparent 1px), radial-gradient(circle at 100px 20px, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
        backgroundSize: '150px 150px',
    }
};


export function PetChatView({
  pet,
  user,
  setView,
  diaryEntries,
  emotionsList,
}: PetChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initialContext, setInitialContext] = useState<{
    contextString: string;
    displayFeelings: Emotion[];
  } | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const roomContainerRef = useRef<HTMLDivElement>(null);
  const { firestore } = useFirebase();

  const userProfileRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const [accessoryPositions, setAccessoryPositions] = useState(userProfile?.petAccessoryPositions || {});

  useEffect(() => {
    if (userProfile?.petAccessoryPositions) {
      setAccessoryPositions(userProfile.petAccessoryPositions);
    }
  }, [userProfile?.petAccessoryPositions]);

  const debouncedUpdatePositions = useCallback(
    debounce((newPositions) => {
        if (userProfileRef) {
            updateDocumentNonBlocking(userProfileRef, { petAccessoryPositions: newPositions });
        }
    }, 1000),
    [userProfileRef]
  );

  const handlePositionChange = useCallback((itemId: string, pos: { x: number; y: number }) => {
    setAccessoryPositions(prev => {
        const newPositions = { ...prev, [itemId]: pos };
        debouncedUpdatePositions(newPositions);
        return newPositions;
    });
  }, [debouncedUpdatePositions]);


  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport =
        scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    if (pet) {
      setMessages([
        { text: `¡Hola! Soy ${pet.name}. ¿Cómo estás hoy?`, sender: 'pet' },
      ]);
      const context = getRecentFeelingsContext(diaryEntries, emotionsList);
      setInitialContext(context);
    }
  }, [pet, diaryEntries, emotionsList]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !pet || !initialContext) return;

    const userMessage: Message = { text: inputValue, sender: 'user' };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    const history = newMessages.slice(0, -1).map((msg) => ({
      role: msg.sender === 'user' ? 'user' : ('model' as 'user' | 'model'),
      content: [{ text: msg.text }],
    }));

    try {
      const response = await chatWithPet({
        userId: user.uid,
        message: inputValue,
        petName: pet.name,
        recentFeelingsContext: initialContext.contextString,
        history: history,
      });

      const petMessage: Message = { text: response.response, sender: 'pet' };
      setMessages((prev) => [...prev, petMessage]);
    } catch (error) {
      console.error('Error chatting with pet:', error);
      const errorMessage: Message = {
        text: 'Uhm... no sé qué decir. Inténtalo de nuevo.',
        sender: 'pet',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const purchasedAccessories = useMemo(() => {
      if (!userProfile?.purchasedItemIds) return [];
      return SHOP_ITEMS.filter(item => item.type === 'pet_accessory' && userProfile.purchasedItemIds.includes(item.id));
  }, [userProfile]);

  const activeBackground = useMemo(() => {
      if (!userProfile?.activePetBackgroundId) return null;
      return SHOP_ITEMS.find(item => item.id === userProfile.activePetBackgroundId);
  }, [userProfile]);

  const currentBackgroundStyle = useMemo(() => {
    if (!activeBackground) return {};
    const styleKey = activeBackground.value;
    return backgroundStyles[styleKey] || {};
}, [activeBackground]);


  if (!pet || isProfileLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-lg bg-muted/50">
        <p className="text-lg font-semibold">
          {isProfileLoading ? "Cargando compañero..." : "No has seleccionado ninguna mascota."}
        </p>
        {!isProfileLoading && <Button onClick={() => setView('sanctuary')} className="mt-4">
          Ir al Santuario
        </Button>}
      </div>
    );
  }

  return (
    <Card className="w-full h-full shadow-lg flex flex-col max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setView('sanctuary')}
        >
          <ArrowLeft />
        </Button>
        <div className="text-5xl">{pet.icon}</div>
        <div>
          <CardTitle className="text-2xl font-bold text-primary">
            {pet.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Tu compañero IA activo
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden flex flex-col gap-4">
        <div className="rounded-lg flex-shrink-0 relative overflow-hidden h-64 border-2" ref={roomContainerRef}>
            <div 
                className="absolute inset-0 transition-all duration-500"
                style={Object.keys(currentBackgroundStyle).length > 0 ? currentBackgroundStyle : { backgroundColor: 'hsl(var(--muted) / 0.5)' }}
            ></div>
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative w-48 h-32">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                        <span className="text-8xl drop-shadow-lg z-20 relative">{pet.icon}</span>
                    </div>
                    {purchasedAccessories.map(item => (
                        <DraggableItem
                            key={item.id}
                            item={item}
                            initialPosition={accessoryPositions[item.id] || { x: Math.random() * 100, y: Math.random() * 50 }}
                            onPositionChange={handlePositionChange}
                            containerRef={roomContainerRef}
                        />
                    ))}
                </div>
            </div>
        </div>

        <ScrollArea className="h-full flex-grow" ref={scrollAreaRef}>
          <div className="p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-end gap-2',
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {msg.sender === 'pet' && (
                  <div className="w-10 h-10 flex-shrink-0 text-3xl">
                     {pet.icon}
                  </div>
                )}
                <div
                  className={cn(
                    'p-3 rounded-lg max-w-xs md:max-w-md lg:max-w-lg',
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
            {initialContext &&
              initialContext.displayFeelings.length > 0 &&
              messages.length <= 2 && (
                <div className="flex items-start gap-3 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg animate-fade-in">
                  <Info className="h-5 w-5 mt-0.5 shrink-0" />
                  <p>
                    Para esta charla, estoy recordando que últimamente te has
                    sentido:{' '}
                    {initialContext.displayFeelings.map((e) => e.name).join(', ')}.
                  </p>
                </div>
              )}
            {isLoading && (
              <div className="flex items-end gap-2 justify-start">
                <div className="w-10 h-10 flex-shrink-0 text-3xl">
                    {pet.icon}
                </div>
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
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Escribe un mensaje a ${pet.name}...`}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !inputValue.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Enviar</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
