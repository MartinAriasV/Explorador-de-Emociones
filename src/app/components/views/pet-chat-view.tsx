
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
import anime from 'animejs';

interface PetChatViewProps {
  pet: SpiritAnimal | null;
  user: User;
  setView: (view: View) => void;
  diaryEntries: DiaryEntry[];
  emotionsList: Emotion[];
  userProfile: UserProfile | null;
  purchasedItems: ShopItem[];
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
    const itemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const currentItem = itemRef.current;
        if (currentItem) {
            anime({
                targets: currentItem,
                translateX: initialPosition.x,
                translateY: initialPosition.y,
                duration: 0,
            });
        }
    }, [initialPosition]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (!itemRef.current || !containerRef.current) return;
        
        const currentItem = itemRef.current;
        anime.remove(currentItem); 

        const containerRect = containerRef.current.getBoundingClientRect();
        
        const onMouseMove = (moveEvent: MouseEvent) => {
            let newX = moveEvent.clientX - containerRect.left - (currentItem.offsetWidth / 2);
            let newY = moveEvent.clientY - containerRect.top - (currentItem.offsetHeight / 2);

            newX = Math.max(0, Math.min(newX, containerRect.width - currentItem.offsetWidth));
            newY = Math.max(0, Math.min(newY, containerRect.height - currentItem.offsetHeight));

            anime({
                targets: currentItem,
                translateX: newX,
                translateY: newY,
                duration: 0,
                easing: 'linear'
            });
        };

        const onMouseUp = (upEvent: MouseEvent) => {
            let finalX = upEvent.clientX - containerRect.left - (currentItem.offsetWidth / 2);
            let finalY = upEvent.clientY - containerRect.top - (currentItem.offsetHeight / 2);
            
            finalX = Math.max(0, Math.min(finalX, containerRect.width - currentItem.offsetWidth));
            finalY = Math.max(0, Math.min(finalY, containerRect.height - currentItem.offsetHeight));

            onPositionChange(item.id, { x: finalX, y: finalY });
            
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        e.preventDefault();
    }, [containerRef, item.id, onPositionChange]);
    
    return (
        <div
            ref={itemRef}
            className="absolute text-5xl cursor-grab w-16 h-16 flex items-center justify-center"
        >
            {item.icon}
        </div>
    );
};

interface DraggablePetProps {
    pet: SpiritAnimal;
    initialPosition: { x: number; y: number };
    onPositionChange: (pos: { x: number; y: number }) => void;
    containerRef: React.RefObject<HTMLDivElement>;
}

const DraggablePet: React.FC<DraggablePetProps> = ({ pet, initialPosition, onPositionChange, containerRef }) => {
    const itemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const currentItem = itemRef.current;
        if (currentItem) {
            anime({
                targets: currentItem,
                translateX: initialPosition.x,
                translateY: initialPosition.y,
                duration: 0,
            });
        }
    }, [initialPosition]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (!itemRef.current || !containerRef.current) return;
        
        const currentItem = itemRef.current;
        anime.remove(currentItem); 

        const containerRect = containerRef.current.getBoundingClientRect();
        
        const onMouseMove = (moveEvent: MouseEvent) => {
            let newX = moveEvent.clientX - containerRect.left - (currentItem.offsetWidth / 2);
            let newY = moveEvent.clientY - containerRect.top - (currentItem.offsetHeight / 2);

            newX = Math.max(0, Math.min(newX, containerRect.width - currentItem.offsetWidth));
            newY = Math.max(0, Math.min(newY, containerRect.height - currentItem.offsetHeight));

            anime({
                targets: currentItem,
                translateX: newX,
                translateY: newY,
                duration: 0,
                easing: 'linear'
            });
        };

        const onMouseUp = (upEvent: MouseEvent) => {
            let finalX = upEvent.clientX - containerRect.left - (currentItem.offsetWidth / 2);
            let finalY = upEvent.clientY - containerRect.top - (currentItem.offsetHeight / 2);
            
            finalX = Math.max(0, Math.min(finalX, containerRect.width - currentItem.offsetWidth));
            finalY = Math.max(0, Math.min(finalY, containerRect.height - currentItem.offsetHeight));

            onPositionChange({ x: finalX, y: finalY });
            
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        e.preventDefault();
    }, [containerRef, onPositionChange]);
    
    return (
        <div
            ref={itemRef}
            className="absolute text-7xl cursor-grab w-24 h-24 flex items-center justify-center bg-card border-2 border-border rounded-full"
            onMouseDown={handleMouseDown}
        >
            <span className="drop-shadow-lg">{pet.icon}</span>
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

export function PetChatView({
  pet,
  user,
  setView,
  diaryEntries,
  emotionsList,
  userProfile,
  purchasedItems,
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
  
  const [accessoryPositions, setAccessoryPositions] = useState(userProfile?.petAccessoryPositions || {});
  const [petPosition, setPetPosition] = useState(userProfile?.petPosition || { x: 200, y: 150 });


  useEffect(() => {
    if (userProfile?.petAccessoryPositions) {
      setAccessoryPositions(userProfile.petAccessoryPositions);
    }
    if (userProfile?.petPosition) {
        setPetPosition(userProfile.petPosition);
    }
  }, [userProfile?.petAccessoryPositions, userProfile?.petPosition]);
  
  const debouncedUpdateAccessoryPositions = useCallback(
    debounce((newPositions) => {
        if (userProfileRef) {
            updateDocumentNonBlocking(userProfileRef, { petAccessoryPositions: newPositions });
        }
    }, 1000),
    [userProfileRef]
  );
  
  const debouncedUpdatePetPosition = useCallback(
    debounce((newPosition) => {
        if (userProfileRef) {
            updateDocumentNonBlocking(userProfileRef, { petPosition: newPosition });
        }
    }, 1000),
    [userProfileRef]
  );


  const handleAccessoryPositionChange = useCallback((itemId: string, pos: { x: number; y: number }) => {
    setAccessoryPositions(prev => {
        const newPositions = { ...prev, [itemId]: pos };
        debouncedUpdateAccessoryPositions(newPositions);
        return newPositions;
    });
  }, [debouncedUpdateAccessoryPositions]);

  const handlePetPositionChange = useCallback((pos: { x: number; y: number }) => {
    setPetPosition(pos);
    debouncedUpdatePetPosition(pos);
  }, [debouncedUpdatePetPosition]);


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
      if (!purchasedItems) return [];
      return purchasedItems.filter(item => item.type === 'pet_accessory');
  }, [purchasedItems]);

  const activeBackground = useMemo(() => {
      if (!userProfile?.activePetBackgroundId) return null;
      return SHOP_ITEMS.find(item => item.id === userProfile.activePetBackgroundId);
  }, [userProfile]);

  const currentBackgroundStyle = useMemo(() => {
    if (activeBackground?.value) {
      return {
        backgroundImage: `url('/backgrounds/${activeBackground.value}.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    return { backgroundColor: 'hsl(var(--muted) / 0.5)' };
}, [activeBackground]);


  if (!pet || !userProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 rounded-lg bg-muted/50">
        <p className="text-lg font-semibold">
          { !userProfile ? "Cargando compañero..." : "No has seleccionado ninguna mascota."}
        </p>
        {userProfile && <Button onClick={() => setView('sanctuary')} className="mt-4">
          Ir al Santuario
        </Button>}
      </div>
    );
  }

  return (
    <div className="h-full">
      <Card className="w-full h-full shadow-lg flex flex-col max-w-4xl mx-auto rounded-lg">
        <CardHeader className="flex flex-row items-center gap-4 p-4 md:p-6 pb-4">
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
        <CardContent className="flex-grow overflow-hidden flex flex-col gap-4 p-4 pt-0 md:p-6 md:pt-0">
            <div ref={roomContainerRef} className="relative rounded-lg flex-shrink-0 overflow-hidden h-64 border-2" >
                <div 
                    className="absolute inset-0 transition-all duration-500"
                    style={currentBackgroundStyle}
                ></div>
                
                 <DraggablePet
                    pet={pet}
                    initialPosition={petPosition}
                    onPositionChange={handlePetPositionChange}
                    containerRef={roomContainerRef}
                />

                {purchasedAccessories.map(item => (
                    <DraggableItem
                        key={item.id}
                        item={item}
                        initialPosition={accessoryPositions[item.id] || { x: Math.random() * 200, y: Math.random() * 100 }}
                        onPositionChange={handleAccessoryPositionChange}
                        containerRef={roomContainerRef}
                    />
                ))}
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
        <CardFooter className="p-4 pt-0 md:p-6 md:pt-0">
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
    </div>
  );
}

    