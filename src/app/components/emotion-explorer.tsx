"use client";

import React, { useState, useEffect, createRef, useCallback, useMemo } from 'react';
import type { Emotion, View, TourStepData, UserProfile, DiaryEntry, Reward } from '@/lib/types';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar, MobileMenuButton } from './app-sidebar';
import { DiaryView } from './views/diary-view';
import { EmocionarioView } from './views/emocionario-view';
import { DiscoverView } from './views/discover-view';
import { CalmView } from './views/calm-view';
import { ReportView } from './views/report-view';
import { ShareView } from './views/share-view';
import { ProfileView } from './views/profile-view';
import { AddEmotionModal } from './modals/add-emotion-modal';
import { QuizModal } from './modals/quiz-modal';
import { WelcomeDialog } from './tour/welcome-dialog';
import { TourPopup } from './tour/tour-popup';
import { TOUR_STEPS, REWARDS, PREDEFINED_EMOTIONS } from '@/lib/constants';
import { StreakView } from './views/streak-view';
import { SanctuaryView } from './views/sanctuary-view';
import { GamesView } from './views/games-view';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Crown, Map } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useFirebase, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, doc, writeBatch, query, where, getDocs, setDoc, getDoc, updateDoc, deleteDoc, runTransaction } from 'firebase/firestore';
import { addDocumentNonBlocking, setDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { calculateDailyStreak, normalizeDate } from '@/lib/utils';
import type { User } from 'firebase/auth';

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

  // --- Firestore Data Hooks ---
  const userProfileRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [firestore, user]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const emotionsQuery = useMemoFirebase(() => (user ? collection(firestore, 'users', user.uid, 'emotions') : null), [firestore, user]);
  const { data: emotionsList, isLoading: areEmotionsLoading } = useCollection<Emotion>(emotionsQuery);
  
  const diaryEntriesQuery = useMemoFirebase(() => (user ? collection(firestore, 'users', user.uid, 'diaryEntries') : null), [firestore, user]);
  const { data: diaryEntries, isLoading: areDiaryEntriesLoading } = useCollection<DiaryEntry>(diaryEntriesQuery);

  const [newlyUnlockedReward, setNewlyUnlockedReward] = useState<Reward | null>(null);
  
  const isLoading = isProfileLoading || areEmotionsLoading || areDiaryEntriesLoading;

  const addInitialEmotions = useCallback(async (userId: string) => {
    if (!firestore) return;
    const emotionsCollectionRef = collection(firestore, 'users', userId, 'emotions');
    // For new users, we can just write the batch. No need to check for existing emotions.
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
        unlockedAnimalIds: [],
        entryCount: 0,
        emotionCount: 5,
        currentStreak: 0,
        lastEntryDate: new Date(0).toISOString(), // Epoch time
      };
      // Use the non-blocking version to avoid issues, but we still need to wait for this
      // for the initial setup to proceed correctly.
      await setDoc(userDocRef, newProfile);
      await addInitialEmotions(user.uid);
      return true; // Indicates a new user was created
    }
    return false; // Indicates user already existed
  }, [user, firestore, addInitialEmotions]);


  const [addingEmotionData, setAddingEmotionData] = useState<Partial<Emotion> | null>(null);
  const [editingEmotion, setEditingEmotion] = useState<Emotion | null>(null);
  
  const [quizDate, setQuizDate] = useState<Date | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // This useEffect runs ONCE after the initial data load.
  // It's responsible for checking if a profile exists and creating one if it doesn't.
  // It also handles showing the welcome tour for brand new users.
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
      setIsInitialLoad(false); // Mark initial load as complete
    }
  }, [user, isLoading, isInitialLoad, addProfileIfNotExists]);


  const [tourStep, setTourStep] = useState(0);

  const tourRefs = TOUR_STEPS.reduce((acc, step) => {
    acc[step.refKey] = createRef<HTMLLIElement>();
    return acc;
  }, {} as { [key: string]: React.RefObject<HTMLLIElement> });

    // --- Reward Logic ---
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

  const addDiaryEntry = async (entryData: Omit<DiaryEntry, 'id' | 'userId'>, trigger: 'addEntry' | 'recoverDay' = 'addEntry') => {
    if (!user || !firestore) return;

    const userProfileRef = doc(firestore, 'users', user.uid);
    const newDiaryEntryRef = doc(collection(firestore, 'users', user.uid, 'diaryEntries'));

    try {
        await runTransaction(firestore, async (transaction) => {
            const userProfileDoc = await transaction.get(userProfileRef);
            if (!userProfileDoc.exists()) {
                throw "User profile does not exist!";
            }

            const profileData = userProfileDoc.data() as UserProfile;
            let newStreak = profileData.currentStreak || 0;
            const lastEntryDate = normalizeDate(profileData.lastEntryDate);
            const newEntryDate = normalizeDate(entryData.date);
            
            const oneDay = 24 * 60 * 60 * 1000;
            const daysDifference = (newEntryDate - lastEntryDate) / oneDay;

            if (daysDifference > 0) { // Only update streak if it's a new day
                if (daysDifference === 1) {
                    newStreak += 1; // It's a consecutive day
                } else {
                    newStreak = 1; // Streak is broken, reset to 1
                }
            }
            // If daysDifference is 0 or less, do nothing to the streak.

            const newEntryCount = (profileData.entryCount || 0) + 1;

            // Update profile
            transaction.update(userProfileRef, {
                entryCount: newEntryCount,
                currentStreak: newStreak,
                lastEntryDate: new Date(newEntryDate).toISOString(),
            });

            // Create new diary entry
            transaction.set(newDiaryEntryRef, {
                ...entryData,
                userId: user.uid,
                id: newDiaryEntryRef.id,
            });
        });

        // After transaction is successful, check for rewards
        await checkAndUnlockRewards(trigger);

    } catch (e) {
        console.error("Transaction failed: ", e);
        toast({
            title: "Error al guardar",
            description: "No se pudo guardar la entrada del diario. Inténtalo de nuevo.",
            variant: "destructive",
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

  const setUserProfile = (profile: Partial<Omit<UserProfile, 'id'>>) => {
    if (!user || !userProfile) return;
    const userProfileRef = doc(firestore, 'users', user.uid);
    // Combine with existing profile to ensure all fields are present for rules validation
    const updatedProfile = { ...userProfile, ...profile };
    updateDocumentNonBlocking(userProfileRef, updatedProfile);
  };

    const saveEmotion = async (emotionData: Omit<Emotion, 'id' | 'userId'> & { id?: string }) => {
    if (!user || !firestore) return;
    
    if (emotionsList && emotionsList.some(e => e.name.toLowerCase() === emotionData.name.toLowerCase() && e.id !== emotionData.id)) {
        toast({
            title: "Emoción Duplicada",
            description: `Ya tienes una emoción llamada "${emotionData.name}".`,
            variant: "destructive",
        });
        return;
    }

    const emotionsCollection = collection(firestore, 'users', user.uid, 'emotions');
    const userProfileRef = doc(firestore, 'users', user.uid);
    const isNew = !emotionData.id;

    try {
        await runTransaction(firestore, async (transaction) => {
            if (isNew) {
                const userProfileDoc = await transaction.get(userProfileRef);
                if (!userProfileDoc.exists()) {
                    throw "User profile does not exist!";
                }
                const newEmotionCount = (userProfileDoc.data().emotionCount || 0) + 1;
                transaction.update(userProfileRef, { emotionCount: newEmotionCount });
            }

            const dataToSave = { ...emotionData, userId: user.uid };
            let emotionRef;

            if (isNew) {
                emotionRef = doc(emotionsCollection);
                transaction.set(emotionRef, { ...dataToSave, id: emotionRef.id });
            } else {
                emotionRef = doc(emotionsCollection, emotionData.id!);
                transaction.update(emotionRef, dataToSave);
            }
        });
        
        toast({
            title: isNew ? "Emoción Añadida" : "Emoción Actualizada",
            description: `"${emotionData.name}" ha sido ${isNew ? 'añadida a' : 'actualizada en'} tu emocionario.`,
        });

        if (isNew) {
            await checkAndUnlockRewards('addEmotion');
        }

    } catch (e) {
        console.error("Save emotion transaction failed: ", e);
        toast({
            title: "Error al guardar emoción",
            description: "No se pudo guardar la emoción. Por favor, inténtalo de nuevo.",
            variant: "destructive",
        });
    }
  };

    const deleteEmotion = async (emotionId: string) => {
    if (!user || !firestore) return;
  
    const batch = writeBatch(firestore);
    const userProfileRef = doc(firestore, 'users', user.uid);
    const emotionDoc = doc(firestore, 'users', user.uid, 'emotions', emotionId);

    batch.delete(emotionDoc);
  
    const diaryCollection = collection(firestore, 'users', user.uid, 'diaryEntries');
    const q = query(diaryCollection, where("emotionId", "==", emotionId));
    
    try {
      // It's better to update the emotion count in a transaction, but for simplicity in deletion, we can do it separately.
      const userProfileSnap = await getDoc(userProfileRef);
      if (userProfileSnap.exists()) {
          const currentCount = userProfileSnap.data().emotionCount || 0;
          batch.update(userProfileRef, { emotionCount: Math.max(0, currentCount - 1) });
      }

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      toast({ title: "Emoción eliminada", description: "La emoción y sus entradas asociadas han sido eliminadas." });
    } catch (error) {
      console.error("Error deleting emotion and associated entries: ", error);
       toast({ title: "Error al eliminar", description: "No se pudo eliminar la emoción.", variant: "destructive" });
    }
  };

    const updateDiaryEntry = async (updatedEntry: DiaryEntry) => {
    if (!user) return;
    const entryDoc = doc(firestore, 'users', user.uid, 'diaryEntries', updatedEntry.id);
    updateDocumentNonBlocking(entryDoc, { ...updatedEntry });
  };
  
  const deleteDiaryEntry = async (entryId: string) => {
    if (!user || !firestore) return;
    const entryDoc = doc(firestore, 'users', user.uid, 'diaryEntries', entryId);

     try {
        await runTransaction(firestore, async (transaction) => {
            const userProfileRef = doc(firestore, 'users', user.uid);
            const userProfileDoc = await transaction.get(userProfileRef);
            if (!userProfileDoc.exists()) {
                throw "User profile not found";
            }
            
            const newEntryCount = (userProfileDoc.data().entryCount || 1) - 1;
            transaction.update(userProfileRef, { entryCount: Math.max(0, newEntryCount) });

            transaction.delete(entryDoc);
        });

        toast({ title: "Entrada eliminada", description: "La entrada del diario ha sido eliminada." });
        // Note: Recalculating streak after deletion is complex and might be better handled by a batch job or ignored on client-side.
        // For simplicity, we are not recalculating streak here.

    } catch (e) {
        console.error("Error deleting diary entry: ", e);
        toast({ title: "Error", description: "No se pudo eliminar la entrada.", variant: "destructive" });
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
    const nextStepIndex = tourStep; // Current step is `tourStep - 1`
    if (nextStepIndex < TOUR_STEPS.length) {
      const nextView = TOUR_STEPS[nextStepIndex].refKey.replace('Ref', '') as View;
      setView(nextView);
      setTourStep(tourStep + 1);
    } else {
      setTourStep(0); // End tour
    }
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
                return <GamesView emotionsList={emotionsList || []} />;
            case 'calm':
              return <CalmView />;
            case 'streak':
              return <StreakView diaryEntries={diaryEntries || []} onRecoverDay={startQuiz} />;
            case 'sanctuary':
              return <SanctuaryView unlockedAnimalIds={userProfile?.unlockedAnimalIds || []} />;
            case 'report':
              return <ReportView diaryEntries={diaryEntries || []} emotionsList={emotionsList || []} />;
            case 'share':
              return <ShareView diaryEntries={diaryEntries || []} emotionsList={emotionsList || []} userProfile={userProfile!} onShare={handleShare} />;
            case 'profile':
              return <ProfileView userProfile={userProfile} setUserProfile={setUserProfile} />;
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
