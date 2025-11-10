
"use client";

import React, { useState, useEffect, createRef, useCallback, useMemo } from 'react';
import type { Emotion, View, TourStepData, UserProfile, DiaryEntry, Reward, SpiritAnimal, ShopItem } from '@/lib/types';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar, MobileMenuButton } from './app-sidebar';
import { DiaryView } from './views/diary-view';
import { EmocionarioView } from './views/emocionario-view';
import { DiscoverView } from './views/discover-view';
import { CalmView } from './views/calm-view';
import { ReportView } from './views/report-view';
import { ShareView } from './views/share-view';
import { ProfileView } from './views/profile-view';
import { ShopView } from './views/shop-view';
import { AddEmotionModal } from './modals/add-emotion-modal';
import { QuizModal } from './modals/quiz-modal';
import { WelcomeDialog } from './tour/welcome-dialog';
import { TourPopup } from './tour/tour-popup';
import { TOUR_STEPS, REWARDS, PREDEFINED_EMOTIONS, SHOP_ITEMS, SPIRIT_ANIMALS } from '@/lib/constants';
import { StreakView } from './views/streak-view';
import { SanctuaryView } from './views/sanctuary-view';
import { GamesView } from './views/games-view';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Crown, Map } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useFirebase, useCollection, useMemoFirebase, useDoc, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, writeBatch, query, where, getDocs, setDoc, getDoc, updateDoc, deleteDoc, runTransaction, arrayUnion } from 'firebase/firestore';
import { addDocumentNonBlocking, setDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { calculateDailyStreak, cn } from '@/lib/utils';
import type { User } from 'firebase/auth';
import { PetChatView } from './views/pet-chat-view';
import useLocalStorage from '@/hooks/use-local-storage';

interface EmotionExplorerProps {
  user: User;
}

const rarityTextStyles: { [key: string]: string } = {
    'Común': 'text-gray-500 dark:text-gray-400',
    'Poco Común': 'text-green-600 dark:text-green-400',
    'Raro': 'text-blue-600 dark:text-blue-500',
    'Épico': 'text-purple-600 dark:text-purple-500',
    'Legendario': 'text-amber-500 dark:text-amber-400',
}

const rarityBorderStyles: { [key: string]: string } = {
    'Común': 'border-gray-300 dark:border-gray-700',
    'Poco Común': 'border-green-500',
    'Raro': 'border-blue-500',
    'Épico': 'border-purple-500',
    'Legendario': 'border-amber-400',
}

export default function EmotionExplorer({ user }: EmotionExplorerProps) {
  const [view, setView] = useState<View>('diary');
  const { toast } = useToast();
  const { firestore } = useFirebase();

  const userProfileRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [firestore, user]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const emotionsQuery = useMemoFirebase(() => (user ? collection(firestore, 'users', user.uid, 'emotions') : null), [firestore, user]);
  const { data: emotionsList, isLoading: areEmotionsLoading } = useCollection<Emotion>(emotionsQuery);
  
  const diaryEntriesQuery = useMemoFirebase(() => (user ? collection(firestore, 'users', user.uid, 'diaryEntries') : null), [firestore, user]);
  const { data: diaryEntries, isLoading: areDiaryEntriesLoading } = useCollection<DiaryEntry>(diaryEntriesQuery);

  const [newlyUnlockedReward, setNewlyUnlockedReward] = useState<Reward | null>(null);
  
  const isLoading = isProfileLoading || areEmotionsLoading || areDiaryEntriesLoading;

  const activePet = useMemo(() => {
    if (!userProfile?.activePetId) return SPIRIT_ANIMALS.find(p => p.id === 'loyal-dog') || null;
    return SPIRIT_ANIMALS.find(p => p.id === userProfile.activePetId) || null;
  }, [userProfile]);


  const purchasedItems = useMemo(() => {
    if (!userProfile?.purchasedItemIds) return [];
    return SHOP_ITEMS.filter(item => userProfile.purchasedItemIds.includes(item.id));
  }, [userProfile]);

  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('theme', 'light');

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);
  

  const addInitialEmotions = useCallback(async (userId: string) => {
    if (!firestore) return;
    const emotionsCollectionRef = collection(firestore, 'users', userId, 'emotions');
    const batch = writeBatch(firestore);
    PREDEFINED_EMOTIONS.slice(0, 5).forEach(emotion => {
      const newEmotionRef = doc(emotionsCollectionRef);
      batch.set(newEmotionRef, {
        ...emotion,
        userId: userId,
        id: newEmotionRef.id,
        isCustom: false,
      });
    });
    await batch.commit();
  }, [firestore]);


  const addProfileIfNotExists = useCallback(async (): Promise<boolean> => {
    if (!user || !firestore) return false;
    
    const userDocRef = doc(firestore, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      console.log("No profile found for user, creating one...");
      const newProfile: UserProfile = {
        id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || "Viajero Anónimo",
        email: user.email || 'no-email-provided',
        avatar: '😊',
        avatarType: 'emoji',
        unlockedAnimalIds: ['loyal-dog'],
        points: 0,
        purchasedItemIds: [],
        equippedItems: {},
        ascentHighScore: 0,
        activePetId: 'loyal-dog',
        equippedPetAccessories: {},
        activePetBackgroundId: null,
      };
      await setDoc(userDocRef, newProfile);
      await addInitialEmotions(user.uid);
      return true; 
    }
    return false;
  }, [user, firestore, addInitialEmotions]);


  const [addingEmotionData, setAddingEmotionData] = useState<Partial<Emotion> | null>(null);
  const [editingEmotion, setEditingEmotion] = useState<Emotion | null>(null);
  
  const [quizDate, setQuizDate] = useState<Date | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (user && !isLoading && isInitialLoad) {
      addProfileIfNotExists().then(isNewUser => {
        if (isNewUser) {
          const timer = setTimeout(() => {
            setShowWelcome(true);
          }, 500);
          return () => clearTimeout(timer);
        }
      });
      setIsInitialLoad(false); 
    }
  }, [user, isLoading, isInitialLoad, addProfileIfNotExists]);


  const [tourStep, setTourStep] = useState(0);

  const tourRefs = TOUR_STEPS.reduce((acc, step) => {
    acc[step.refKey] = createRef<HTMLLIElement>();
    return acc;
  }, {} as { [key: string]: React.RefObject<HTMLLIElement> });

  const checkAndUnlockRewards = useCallback(async (
    trigger: 'addEntry' | 'addEmotion' | 'share' | 'recoverDay'
  ) => {
      if (!user || !userProfile) return;
      const userProfileRef = doc(firestore, 'users', user.uid);

      const freshProfileSnap = await getDoc(userProfileRef);
      const freshProfile = freshProfileSnap.data() as UserProfile;
      const diaryEntriesCollection = collection(firestore, 'users', user.uid, 'diaryEntries');
      const emotionsCollection = collection(firestore, 'users', user.uid, 'emotions');

      const diarySnapshot = await getDocs(diaryEntriesCollection);
      const currentDiaryEntries = diarySnapshot.docs.map(d => d.data() as DiaryEntry);
      
      const emotionSnapshot = await getDocs(emotionsCollection);
      const currentEmotions = emotionSnapshot.docs.map(d => d.data() as Emotion);

      const previouslyUnlocked = new Set(freshProfile.unlockedAnimalIds || []);
      let newUnlockedIds = [...(freshProfile.unlockedAnimalIds || [])];
      let justUnlockedReward: Reward | null = null;
      
      const dailyStreak = calculateDailyStreak(currentDiaryEntries);
      const entryCount = currentDiaryEntries.length;
      const emotionCount = currentEmotions.length;

      for (const reward of REWARDS) {
        if (previouslyUnlocked.has(reward.animal.id)) continue;
    
        let unlocked = false;
        switch(reward.type) {
          case 'streak':
             if (trigger === 'addEntry' || trigger === 'recoverDay') {
               unlocked = dailyStreak >= reward.value;
             }
             break;
          case 'entry_count':
            if (trigger === 'addEntry' || trigger === 'recoverDay') {
                unlocked = entryCount >= reward.value;
            }
            break;
          case 'emotion_count':
            if (trigger === 'addEmotion') {
               unlocked = emotionCount >= reward.value;
            }
            break;
          case 'share':
            if (trigger === 'share') {
                unlocked = true;
            }
            break;
          case 'special':
            if (trigger === 'recoverDay' && reward.id === 'phoenix-reward') {
                unlocked = true;
            }
            break;
        }
    
        if (unlocked) {
          if (!newUnlockedIds.includes(reward.animal.id)) {
              newUnlockedIds.push(reward.animal.id);
              if (!justUnlockedReward) {
                  justUnlockedReward = reward;
              }
          }
        }
      }
    
      if (newUnlockedIds.length > (freshProfile.unlockedAnimalIds?.length || 0)) {
        updateDocumentNonBlocking(userProfileRef, { unlockedAnimalIds: newUnlockedIds });
        if (justUnlockedReward) {
          setNewlyUnlockedReward(justUnlockedReward);
        }
      }
  }, [user, firestore, userProfile]);

  const handleShare = () => {
    checkAndUnlockRewards('share');
  };

  const addPoints = async (amount: number) => {
    if (!user || !firestore || !userProfile) return;
    const userDocRef = doc(firestore, 'users', user.uid);
    try {
        await runTransaction(firestore, async (transaction) => {
            const userDoc = await transaction.get(userDocRef);
            if (!userDoc.exists()) {
                throw "User profile does not exist!";
            }
            const currentPoints = userDoc.data().points || 0;
            const newPoints = currentPoints + amount;
            transaction.update(userDocRef, { points: newPoints });
        });
        toast({
            title: `¡Has ganado ${amount} puntos!`,
            description: "¡Sigue así!",
        });
    } catch (e) {
        console.error("Failed to add points:", e);
        errorEmitter.emit(
            'permission-error',
            new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'update',
                requestResourceData: { points: `+${amount}` },
            })
        );
    }
  };
  

    const addDiaryEntry = async (entryData: Omit<DiaryEntry, 'id' | 'userId'>, trigger: 'addEntry' | 'recoverDay' = 'addEntry') => {
        if (!user || !firestore) return;

        try {
            await runTransaction(firestore, async (transaction) => {
                const userDocRef = doc(firestore, 'users', user.uid);
                const newDiaryEntryRef = doc(collection(firestore, 'users', user.uid, 'diaryEntries'));

                const userDoc = await transaction.get(userDocRef);
                if (!userDoc.exists()) {
                    throw "User profile does not exist!";
                }

                const profileData = userDoc.data() as UserProfile;
                const newPoints = (profileData.points || 0) + 10;

                transaction.set(newDiaryEntryRef, { ...entryData, userId: user.uid, id: newDiaryEntryRef.id });
                transaction.update(userDocRef, { points: newPoints });
            });
            
            toast({
                title: "¡Entrada Guardada!",
                description: `Has ganado 10 puntos. ¡Sigue así!`,
            });
            
            await checkAndUnlockRewards(trigger);

        } catch (error) {
            console.error("Transaction failed: ", error);
            toast({
                variant: "destructive",
                title: "Error al guardar",
                description: "No se pudo guardar la entrada. Inténtalo de nuevo.",
            });
        }
  };
  
  const handleQuizComplete = (success: boolean, date: Date | null) => {
    if (success && date && userProfile && emotionsList) {
        addDiaryEntry({
            date: date.toISOString(),
            emotionId: emotionsList.find(e => e.name.toLowerCase() === 'calma')?.id || emotionsList[0].id,
            text: 'Día recuperado completando el desafío de la racha. ¡Buen trabajo!',
          }, 'recoverDay');
    }
  };
  
  const handleAscentGameEnd = async (score: number) => {
    if (!user || !firestore || !userProfile) return;
    const userDocRef = doc(firestore, 'users', user.uid);

    let isNewHighScore = false;
    try {
        await runTransaction(firestore, async (transaction) => {
            const userDoc = await transaction.get(userDocRef);
            if (!userDoc.exists()) {
                throw new Error('User profile does not exist!');
            }

            const profileData = userDoc.data() as UserProfile;
            const currentHighScore = profileData.ascentHighScore || 0;
            const newPoints = (profileData.points || 0) + score;

            const updates: { points: number; ascentHighScore?: number } = {
                points: newPoints,
            };

            if (score > currentHighScore) {
                updates.ascentHighScore = score;
                isNewHighScore = true;
            }
            
            transaction.update(userDocRef, updates);
        });

        if (isNewHighScore) {
            toast({ title: `¡Nuevo récord!`, description: `Has conseguido ${score} puntos.` });
        } else {
            toast({ title: '¡Buen juego!', description: `Has ganado ${score} puntos.` });
        }

    } catch (error) {
        const profileData = userProfile;
        const currentHighScore = profileData.ascentHighScore || 0;
        const newPoints = (profileData.points || 0) + score;
        
        const requestData: { points: number; ascentHighScore?: number } = {
            points: newPoints
        };
        if (score > currentHighScore) {
            requestData.ascentHighScore = score;
        }

        errorEmitter.emit(
            'permission-error',
            new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'update',
                requestResourceData: requestData
            })
        );
    }
  };

  const setUserProfile = (profile: Partial<Omit<UserProfile, 'id'>>) => {
    if (!user || !userProfile) return;
    const userProfileRef = doc(firestore, 'users', user.uid);
    updateDocumentNonBlocking(userProfileRef, profile);
  };

    const saveEmotion = async (emotionData: Omit<Emotion, 'id' | 'userId'> & { id?: string }) => {
    if (!user) return;
    
    if (emotionsList && emotionsList.some(e => e.name.toLowerCase() === emotionData.name.toLowerCase() && e.id !== emotionData.id)) {
        toast({
            title: "Emoción Duplicada",
            description: `Ya tienes una emoción llamada "${emotionData.name}".`,
            variant: "destructive",
        });
        return;
    }

    const emotionsCollection = collection(firestore, 'users', user.uid, 'emotions');
    
    const isNew = !emotionData.id;

    const dataToSave = {
      ...emotionData,
      userId: user.uid,
    };

    if (emotionData.id) {
      const emotionRef = doc(emotionsCollection, emotionData.id);
      updateDocumentNonBlocking(emotionRef, dataToSave);
      toast({ title: "Emoción Actualizada", description: `"${emotionData.name}" ha sido actualizada.` });
    } else {
      const newDocRef = doc(emotionsCollection);
      setDocumentNonBlocking(newDocRef, {...dataToSave, id: newDocRef.id}, {merge: false});
      toast({ title: "Emoción Añadida", description: `"${emotionData.name}" ha sido añadida a tu emocionario.` });
    }
    
    if (isNew) {
      await checkAndUnlockRewards('addEmotion');
    }
  };

    const deleteEmotion = async (emotionId: string) => {
    if (!user) return;
  
    const batch = writeBatch(firestore);
  
    const emotionDoc = doc(firestore, 'users', user.uid, 'emotions', emotionId);
    batch.delete(emotionDoc);
  
    const diaryCollection = collection(firestore, 'users', user.uid, 'diaryEntries');
    const q = query(diaryCollection, where("emotionId", "==", emotionId));
    
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    } catch (error) {
      console.error("Error deleting emotion and associated entries: ", error);
    }
  };

    const updateDiaryEntry = async (updatedEntry: DiaryEntry) => {
    if (!user) return;
    const entryDoc = doc(firestore, 'users', user.uid, 'diaryEntries', updatedEntry.id);
    updateDocumentNonBlocking(entryDoc, { ...updatedEntry });
  };
  
  const deleteDiaryEntry = async (entryId: string) => {
    if (!user) return;
    const entryDoc = doc(firestore, 'users', user.uid, 'diaryEntries', entryId);
    deleteDocumentNonBlocking(entryDoc);
  };
  
  const handlePurchaseItem = async (item: ShopItem) => {
      if (!user || !userProfile || !firestore) return;

      if (userProfile.purchasedItemIds?.includes(item.id)) {
        toast({ variant: "default", title: "Artículo ya comprado", description: "Ya posees este artículo." });
        return;
      }
      
      if ((userProfile.points || 0) < item.cost) {
          toast({ variant: "destructive", title: "Puntos insuficientes", description: "¡No tienes suficientes puntos para comprar esto!" });
          return;
      }

      const userDocRef = doc(firestore, 'users', user.uid);

      try {
          await runTransaction(firestore, async (transaction) => {
              const userDoc = await transaction.get(userDocRef);
              if (!userDoc.exists()) {
                  throw new Error("User profile does not exist!");
              }
              
              const currentProfile = userDoc.data() as UserProfile;
              const currentPoints = currentProfile.points || 0;

              if (currentPoints < item.cost) {
                  throw new Error("Puntos insuficientes");
              }

              const newPoints = currentPoints - item.cost;
              transaction.update(userDocRef, {
                  points: newPoints,
                  purchasedItemIds: arrayUnion(item.id)
              });
          });

          toast({ title: "¡Compra exitosa!", description: `Has comprado "${item.name}".` });
      } catch (error: any) {
          toast({
              variant: "destructive",
              title: "Error en la compra",
              description: error.message === "Puntos insuficientes" 
                  ? "¡No tienes suficientes puntos!" 
                  : "No se pudo completar la compra. Inténtalo de nuevo.",
          });
      }
  };


  const handleOpenAddEmotionModal = (emotionData: Partial<Emotion>) => {
    setAddingEmotionData(emotionData);
  };

  const handleEditEmotion = (emotion: Emotion) => {
    setEditingEmotion(emotion);
    setView('emocionario');
  };

  const handleCancelEdit = () => {
    setEditingEmotion(null);
    setView('emocionario');
  }

  const startQuiz = (date: Date) => {
    setQuizDate(date);
    setShowQuiz(true);
  };

  const onQuizComplete = (success: boolean) => {
    setShowQuiz(false);
    handleQuizComplete(success, quizDate);
    
    if (success) {
      toast({
        title: "¡Día Recuperado!",
        description: "Has superado el desafío y recuperado tu racha.",
      });
    } else {
      toast({
        title: "Desafío No Superado",
        description: "No has alcanzado la puntuación necesaria. ¡Inténtalo de nuevo!",
        variant: "destructive",
      });
    }
    setQuizDate(null);
  };


  const startTour = () => {
    setShowWelcome(false);
    setView(TOUR_STEPS[0].refKey.replace('Ref', '') as View);
    setTourStep(1);
  };
  
  const skipTour = () => {
    setShowWelcome(false);
    setTourStep(0);
  };

  const nextTourStep = () => {
    const nextStepIndex = tourStep;
    if (nextStepIndex < TOUR_STEPS.length) {
      const nextView = TOUR_STEPS[nextStepIndex].refKey.replace('Ref', '') as View;
      setView(nextView);
      setTourStep(tourStep + 1);
    } else {
      setTourStep(0); 
    }
  };
  
  const handleSelectPet = (pet: SpiritAnimal) => {
    if (userProfileRef) {
        updateDocumentNonBlocking(userProfileRef, { activePetId: pet.id });
    }
    setView('pet-chat');
  };

  const renderView = () => {
    return (
      <div className="animate-fade-in-up">
        {(() => {
          switch (view) {
            case 'diary':
              return <DiaryView 
                        emotionsList={emotionsList || []} 
                        diaryEntries={diaryEntries || []} 
                        addDiaryEntry={addDiaryEntry}
                        updateDiaryEntry={updateDiaryEntry}
                        deleteDiaryEntry={deleteDiaryEntry}
                        setView={setView} 
                      />;
            case 'emocionario':
              return <EmocionarioView 
                        emotionsList={emotionsList || []} 
                        addEmotion={saveEmotion} 
                        onEditEmotion={handleEditEmotion} 
                        onDeleteEmotion={deleteEmotion}
                        editingEmotion={editingEmotion}
                        onCancelEdit={handleCancelEdit}
                     />;
            case 'discover':
              return <DiscoverView onAddPredefinedEmotion={saveEmotion} />;
            case 'games':
                return <GamesView 
                           emotionsList={emotionsList || []}
                           userProfile={userProfile!}
                           addPoints={addPoints} 
                           user={user} 
                           onAscentGameEnd={handleAscentGameEnd}
                       />;
            case 'calm':
              return <CalmView />;
            case 'streak':
              return <StreakView diaryEntries={diaryEntries || []} onRecoverDay={startQuiz} />;
            case 'sanctuary':
              return <SanctuaryView 
                        userProfile={userProfile} 
                        onSelectPet={handleSelectPet}
                      />;
            case 'pet-chat':
              return <PetChatView 
                        pet={activePet} 
                        user={user} 
                        setView={setView} 
                        diaryEntries={diaryEntries || []}
                        emotionsList={emotionsList || []}
                     />;
            case 'shop':
                return <ShopView 
                          userProfile={userProfile!}
                          onPurchaseItem={handlePurchaseItem}
                        />;
            case 'report':
              return <ReportView diaryEntries={diaryEntries || []} emotionsList={emotionsList || []} />;
            case 'share':
              return <ShareView diaryEntries={diaryEntries || []} emotionsList={emotionsList || []} userProfile={userProfile!} onShare={handleShare} />;
            case 'profile':
              return <ProfileView userProfile={userProfile} setUserProfile={setUserProfile} purchasedItems={purchasedItems} />;
            default:
              return <DiaryView 
                        emotionsList={emotionsList || []} 
                        diaryEntries={diaryEntries || []} 
                        addDiaryEntry={addDiaryEntry}
                        updateDiaryEntry={updateDiaryEntry}
                        deleteDiaryEntry={deleteDiaryEntry}
                        setView={setView} 
                      />;
          }
        })()}
      </div>
    );
  };
  
  if (isLoading || !userProfile) {
    return (
        <div className="flex h-screen w-screen items-center justify-center flex-col gap-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg text-primary">Cargando tu diario...</p>
        </div>
    );
  }
  
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen bg-background">
        <AppSidebar view={view} setView={setView} userProfile={userProfile} diaryEntries={diaryEntries || []} refs={tourRefs} />
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="p-2 md:hidden flex items-center border-b">
             <MobileMenuButton />
             <h1 className="text-lg font-bold text-primary ml-2">Diario de Emociones</h1>
          </header>
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            {renderView()}
          </div>
        </main>
      </div>
      
      <AddEmotionModal
        initialData={addingEmotionData}
        onSave={saveEmotion}
        onClose={() => setAddingEmotionData(null)}
      />

      {showQuiz && (
        <QuizModal 
          onClose={() => setShowQuiz(false)} 
          onComplete={onQuizComplete} 
        />
      )}

      <WelcomeDialog
        open={showWelcome}
        onStartTour={startTour}
        onSkipTour={skipTour}
      />
      
      <TourPopup
        step={tourStep}
        steps={TOUR_STEPS}
        refs={tourRefs}
        onNext={nextTourStep}
        onSkip={() => setTourStep(0)}
      />

      <AlertDialog open={!!newlyUnlockedReward}>
        <AlertDialogContent className={`p-0 overflow-hidden border-4 ${newlyUnlockedReward ? rarityBorderStyles[newlyUnlockedReward.animal.rarity] : 'border-transparent'}`}>
          <AlertDialogHeader className="p-6 pb-0">
            <AlertDialogTitle className="flex items-center justify-center text-center gap-2 text-2xl font-bold">
              <Crown className="w-8 h-8 text-amber-400" />
              ¡Recompensa Desbloqueada!
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="flex flex-col items-center gap-2 pt-4 pb-8 text-center bg-background/50">
              <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className={`absolute inset-0 bg-gradient-to-t ${newlyUnlockedReward ? rarityTextStyles[newlyUnlockedReward.animal.rarity]?.replace('text-','from-') : ''}/20 to-transparent rounded-full blur-2xl`}></div>
                  <span className="text-8xl drop-shadow-lg">{newlyUnlockedReward?.animal.icon}</span>
              </div>
              <span className={`block font-bold text-3xl ${newlyUnlockedReward ? rarityTextStyles[newlyUnlockedReward.animal.rarity] : ''}`}>{newlyUnlockedReward?.animal.name}</span>
              <p className="block text-sm text-muted-foreground max-w-xs">{newlyUnlockedReward?.animal.description}</p>
              <p className={`block text-xs font-semibold uppercase tracking-wider ${newlyUnlockedReward ? rarityTextStyles[newlyUnlockedReward.animal.rarity] : ''}`}>{newlyUnlockedReward?.animal.rarity}</p>
          </div>
          <AlertDialogFooter className="bg-muted/40 p-4 border-t">
              <AlertDialogAction onClick={() => { setNewlyUnlockedReward(null); setView('sanctuary'); }} className="bg-accent text-accent-foreground hover:bg-accent/90 w-full">
                ¡Genial! Ver en mi Santuario
              </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={() => startTour()} 
              className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-accent shadow-lg animate-pulse hover:animate-none"
            >
              <Map className="w-8 h-8" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Realizar Tour Guiado</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

    </SidebarProvider>
  );
}
