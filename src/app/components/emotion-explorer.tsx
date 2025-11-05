"use client";

import React, { useState, useRef, createRef, useEffect } from 'react';
import type { Emotion, DiaryEntry, UserProfile, View, PredefinedEmotion, TourStepData, SpiritAnimal, Reward, QuizQuestion } from '@/lib/types';
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
import { TOUR_STEPS, REWARDS, SPIRIT_ANIMALS } from '@/lib/constants';
import { useFirebase, useUser, useCollection, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { deleteDocumentNonBlocking, setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, doc, writeBatch, query, where, getDocs } from 'firebase/firestore';
import LoginView from './views/login-view';
import { StreakView } from './views/streak-view';
import { SanctuaryView } from './views/sanctuary-view';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { calculateDailyStreak } from '@/lib/utils';
import { Crown, Map } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

interface EmotionExplorerProps {
  isNewUser: boolean;
}

export default function EmotionExplorer({ isNewUser }: EmotionExplorerProps) {
  const [view, setView] = useState<View>('diary');
  const { firestore } = useFirebase();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  // --- Firestore Data ---
  const userProfileRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const emotionsQuery = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'emotions') : null, [firestore, user]);
  const { data: emotionsList, isLoading: areEmotionsLoading } = useCollection<Emotion>(emotionsQuery);
  
  const diaryEntriesQuery = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'diaryEntries') : null, [firestore, user]);
  const { data: diaryEntries, isLoading: areDiaryEntriesLoading } = useCollection<DiaryEntry>(diaryEntriesQuery);
  // --------------------

  const [addingEmotionData, setAddingEmotionData] = useState<Partial<Emotion> & { id?: string } | null>(null);
  const [newlyUnlockedReward, setNewlyUnlockedReward] = useState<Reward | null>(null);
  
  // Quiz state
  const [quizDate, setQuizDate] = useState<Date | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  // Tour state
  const [isNewUserFlow, setIsNewUserFlow] = useState(isNewUser);
  const [tourStep, setTourStep] = useState(0);

  // Refs for the tour
  const tourRefs = TOUR_STEPS.reduce((acc, step) => {
    acc[step.refKey] = createRef<HTMLLIElement>();
    return acc;
  }, {} as { [key: string]: React.RefObject<HTMLLIElement> });

  const checkAndUnlockRewards = (currentProfile: UserProfile, currentDiaryEntries: DiaryEntry[], currentEmotions: Emotion[]) => {
    if (!currentProfile) return;
  
    const previouslyUnlocked = new Set(currentProfile.unlockedAnimalIds || []);
    let newUnlockedIds = [...(currentProfile.unlockedAnimalIds || [])];
    let justUnlockedReward: Reward | null = null;
    
    const dailyStreak = calculateDailyStreak(currentDiaryEntries);
    const entryCount = currentDiaryEntries.length;
    const emotionCount = currentEmotions.length;
    
    for (const reward of REWARDS) {
      if (previouslyUnlocked.has(reward.animal.id)) continue;
  
      let unlocked = false;
      switch(reward.type) {
        case 'streak':
          unlocked = dailyStreak >= reward.value;
          break;
        case 'entry_count':
          unlocked = entryCount >= reward.value;
          break;
        case 'emotion_count':
          unlocked = emotionCount >= reward.value;
          break;
        case 'share':
          // This is handled by handleShare
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
  
    if (newUnlockedIds.length > (currentProfile.unlockedAnimalIds?.length || 0)) {
      setUserProfile({ unlockedAnimalIds: newUnlockedIds });
      if (justUnlockedReward) {
        setNewlyUnlockedReward(justUnlockedReward);
      }
    }
  };

  const handleShare = () => {
    if (!userProfile) return;
    const shareReward = REWARDS.find(r => r.id === 'share-1');
    if (shareReward && !userProfile.unlockedAnimalIds?.includes(shareReward.animal.id)) {
      const currentUnlocked = userProfile.unlockedAnimalIds || [];
      if (!currentUnlocked.includes(shareReward.animal.id)) {
        const newUnlockedIds = [...currentUnlocked, shareReward.animal.id];
        setUserProfile({ unlockedAnimalIds: newUnlockedIds });
        setNewlyUnlockedReward(shareReward);
      }
    }
  };


  const setUserProfile = (profile: Partial<UserProfile>) => {
    if (!userProfileRef) return;
    setDocumentNonBlocking(userProfileRef, profile, { merge: true });
  };

  const saveEmotion = (emotionData: Omit<Emotion, 'id' | 'userProfileId'> & { id?: string }) => {
    if (!user || !userProfile || !diaryEntries || !emotionsList) return;
    const emotionsCollection = collection(firestore, 'users', user.uid, 'emotions');
    
    const promise = emotionData.id
      ? setDocumentNonBlocking(doc(emotionsCollection, emotionData.id), { ...emotionData, userProfileId: user.uid }, { merge: true })
      : addDocumentNonBlocking(emotionsCollection, { ...emotionData, userProfileId: user.uid });
    
    promise.then(() => {
        const currentEmotions = emotionsList || [];
        const newEmotionsList = emotionData.id 
            ? currentEmotions.map(e => e.id === emotionData.id ? {...e, ...emotionData} : e)
            : [...currentEmotions, { ...emotionData, id: 'temp-id', userProfileId: user.uid } as Emotion];
        
        checkAndUnlockRewards(userProfile, diaryEntries || [], newEmotionsList);
    });

    setAddingEmotionData(null);
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
    
    setAddingEmotionData(null);
  };

  const addDiaryEntry = (entryData: Omit<DiaryEntry, 'id' | 'userProfileId'>) => {
    if (!user || !userProfile || !emotionsList || !diaryEntries) return;
    const diaryCollection = collection(firestore, 'users', user.uid, 'diaryEntries');
    addDocumentNonBlocking(diaryCollection, { ...entryData, userProfileId: user.uid })
      .then(() => {
        const newEntry = { ...entryData, id: 'temp-id', userProfileId: user.uid } as DiaryEntry;
        const newDiaryEntries = [...(diaryEntries || []), newEntry];
        checkAndUnlockRewards(userProfile, newDiaryEntries, emotionsList);
      });
  };
  
  const updateDiaryEntry = (updatedEntry: DiaryEntry) => {
    if (!user) return;
    const entryDoc = doc(firestore, 'users', user.uid, 'diaryEntries', updatedEntry.id);
    setDocumentNonBlocking(entryDoc, updatedEntry, { merge: true });
  };
  
  const deleteDiaryEntry = (entryId: string) => {
    if (!user) return;
    const entryDoc = doc(firestore, 'users', user.uid, 'diaryEntries', entryId);
    deleteDocumentNonBlocking(entryDoc);
  };

  const handleOpenAddEmotionModal = (emotionData: Partial<Emotion> & { id?: string }) => {
    setAddingEmotionData(emotionData);
  };

  const startQuiz = (date: Date) => {
    setQuizDate(date);
    setShowQuiz(true);
  };

  const handleQuizComplete = (success: boolean) => {
    setShowQuiz(false);
    if (success && quizDate) {
      const defaultEmotion = emotionsList?.find(e => e.name.toLowerCase() === 'calma') || emotionsList?.[0];
      if (defaultEmotion) {
        addDiaryEntry({
          date: quizDate.toISOString(),
          emotionId: defaultEmotion.id,
          text: 'Día recuperado completando el desafío de la racha. ¡Buen trabajo!',
        });

        const phoenixReward = REWARDS.find(r => r.id === 'phoenix-reward');
        if (phoenixReward && !userProfile?.unlockedAnimalIds?.includes(phoenixReward.animal.id)) {
            const newUnlockedIds = [...(userProfile?.unlockedAnimalIds || []), phoenixReward.animal.id];
            setUserProfile({ unlockedAnimalIds: newUnlockedIds });
            setNewlyUnlockedReward(phoenixReward);
        }

        toast({
          title: "¡Día Recuperado!",
          description: "Has superado el desafío y recuperado tu racha.",
        });
      } else {
        toast({
          title: "Error de Recuperación",
          description: "No se pudo recuperar el día. Necesitas al menos una emoción en tu emocionario.",
          variant: "destructive",
        });
      }
    } else if (!success) {
      toast({
        title: "Desafío No Superado",
        description: "No has alcanzado la puntuación necesaria. ¡Inténtalo de nuevo!",
        variant: "destructive",
      });
    }
    setQuizDate(null);
  };

  const startTour = () => {
    setIsNewUserFlow(false);
    const firstStepView = TOUR_STEPS[0].refKey.replace('Ref', '') as View;
    setView(firstStepView);
    setTourStep(1);
  };
  
  const skipTour = () => {
    setIsNewUserFlow(false);
    setTourStep(0);
  };

  const nextTourStep = () => {
    const nextStepIndex = tourStep; // Current step is tourStep - 1, next step is tourStep
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
              return <EmocionarioView emotionsList={emotionsList || []} addEmotion={saveEmotion} onEditEmotion={handleOpenAddEmotionModal} onDeleteEmotion={deleteEmotion} />;
            case 'discover':
              return <DiscoverView onAddEmotion={handleOpenAddEmotionModal} />;
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
  
  useEffect(() => {
    if(isNewUser) {
      setIsNewUserFlow(true);
    }
  }, [isNewUser]);

  if (isUserLoading || (user && (isProfileLoading || areEmotionsLoading || areDiaryEntriesLoading))) {
    return (
        <div className="flex h-screen w-screen items-center justify-center flex-col gap-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg text-primary">Cargando perfil...</p>
        </div>
    );
  }

  if (!user) {
    return <LoginView />;
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
        onDelete={deleteEmotion}
        onClose={() => setAddingEmotionData(null)}
      />

      {showQuiz && (
        <QuizModal 
          onClose={() => setShowQuiz(false)} 
          onComplete={handleQuizComplete} 
        />
      )}

      <WelcomeDialog
        open={isNewUserFlow}
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
