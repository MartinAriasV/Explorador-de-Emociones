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
import { collection, doc, setDoc, writeBatch, query, where, getDocs } from 'firebase/firestore';
import LoginView from './views/login-view';
import useLocalStorage from '@/hooks/use-local-storage';
import { StreakView } from './views/streak-view';
import { SanctuaryView } from './views/sanctuary-view';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { calculateDailyStreak } from '@/lib/utils';
import { Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const defaultProfile: Omit<UserProfile, 'id' | 'unlockedAnimalIds' | 'emotionCount'> = {
  name: 'Usuario',
  avatar: '😊',
  avatarType: 'emoji',
};

export default function EmotionExplorer() {
  const [view, setView] = useState<View>('diary');
  const { firestore } = useFirebase();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  // --- Firestore Data ---
  const userProfileRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userProfile, isLoading: isProfileLoading, error: profileError } = useDoc<UserProfile>(userProfileRef);

  const emotionsQuery = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'emotions') : null, [firestore, user]);
  const { data: emotionsList, isLoading: isLoadingEmotions } = useCollection<Emotion>(emotionsQuery);
  
  const diaryEntriesQuery = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'diaryEntries') : null, [firestore, user]);
  const { data: diaryEntries, isLoading: isLoadingEntries } = useCollection<DiaryEntry>(diaryEntriesQuery);
  // --------------------

  const [addingEmotionData, setAddingEmotionData] = useState<Partial<Emotion> & { id?: string } | null>(null);
  const [newlyUnlockedReward, setNewlyUnlockedReward] = useState<Reward | null>(null);
  const [sharedOnce, setSharedOnce] = useLocalStorage('emotion-explorer-shared-once', false);
  
  // Quiz state
  const [quizDate, setQuizDate] = useState<Date | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  // Tour state
  const [showWelcome, setShowWelcome] = useLocalStorage('emotion-explorer-show-welcome', true);
  const [tourStep, setTourStep] = useState(0);

  // Refs for the tour
  const tourRefs = TOUR_STEPS.reduce((acc, step) => {
    acc[step.refKey] = createRef<HTMLLIElement>();
    return acc;
  }, {} as { [key: string]: React.RefObject<HTMLLIElement> });

  useEffect(() => {
    if (isProfileLoading || !userProfile || !diaryEntries || !emotionsList) return;

    const dailyStreak = calculateDailyStreak(diaryEntries);
    const entryCount = diaryEntries.length;
    const emotionCount = emotionsList.length;
    const unlockedIds = userProfile.unlockedAnimalIds || [];
    
    const rewardsToUnlock = REWARDS.filter(reward => {
        if (unlockedIds.includes(reward.animal.id)) return false;

        switch(reward.type) {
            case 'streak':
                return dailyStreak >= reward.value;
            case 'entry_count':
                return entryCount >= reward.value;
            case 'emotion_count':
                return emotionCount >= reward.value;
            // The 'share' type is handled separately
            default:
                return false;
        }
    });

    if (rewardsToUnlock.length > 0) {
      const newUnlockedIds = [...unlockedIds, ...rewardsToUnlock.map(r => r.animal.id)];
      setUserProfile({ unlockedAnimalIds: newUnlockedIds });
      // Show popup for the first unlocked reward in the batch
      setNewlyUnlockedReward(rewardsToUnlock[0]);
    }
  }, [diaryEntries, emotionsList, isProfileLoading, userProfile]);

  // Special handler for "share" reward
  const handleShare = () => {
    if (!sharedOnce) {
        const shareReward = REWARDS.find(r => r.id === 'share-1');
        if (shareReward && !userProfile?.unlockedAnimalIds?.includes(shareReward.animal.id)) {
            const newUnlockedIds = [...(userProfile?.unlockedAnimalIds || []), shareReward.animal.id];
            setUserProfile({ unlockedAnimalIds: newUnlockedIds });
            setNewlyUnlockedReward(shareReward);
        }
        setSharedOnce(true);
    }
  };


  const setUserProfile = (profile: Partial<UserProfile>) => {
    if (!userProfileRef) return;
    setDocumentNonBlocking(userProfileRef, profile, { merge: true });
  };

  const saveEmotion = (emotionData: Omit<Emotion, 'id' | 'userProfileId'> & { id?: string }) => {
    if (!user) return;
    const emotionsCollection = collection(firestore, 'users', user.uid, 'emotions');
    
    if (emotionData.id) {
      const emotionDoc = doc(emotionsCollection, emotionData.id);
      setDocumentNonBlocking(emotionDoc, { ...emotionData, userProfileId: user.uid }, { merge: true });
    } else {
      addDocumentNonBlocking(emotionsCollection, { ...emotionData, userProfileId: user.uid });
    }
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
    if (!user) return;
    const diaryCollection = collection(firestore, 'users', user.uid, 'diaryEntries');
    addDocumentNonBlocking(diaryCollection, { ...entryData, userProfileId: user.uid });
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
    setShowWelcome(false);
    setTourStep(1);
    setView('diary');
  };

  const skipTour = () => {
    setShowWelcome(false);
    setTourStep(0);
  };
  
  const nextTourStep = () => {
    if (tourStep < TOUR_STEPS.length) {
      const nextView = TOUR_STEPS[tourStep].refKey.replace('Ref', '') as View;
      setView(nextView);
      setTourStep(tourStep + 1);
    } else {
      setTourStep(0);
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
  
  if (isUserLoading || (user && isProfileLoading)) {
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
        open={showWelcome && tourStep === 0}
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
        <AlertDialogContent>
          <AlertDialogHeader className="items-center text-center">
            <AlertDialogTitle className="flex flex-col items-center text-center gap-2 text-2xl">
              <Crown className="w-10 h-10 text-amber-400" />
              ¡Recompensa Desbloqueada!
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¡Felicidades! Has desbloqueado al:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col items-center gap-2 pt-4">
              <span className="text-7xl">{newlyUnlockedReward?.animal.icon}</span>
              <span className="block font-bold text-2xl text-primary">{newlyUnlockedReward?.animal.name}</span>
              <span className="block text-sm text-muted-foreground">{newlyUnlockedReward?.animal.description}</span>
              <span className="block text-xs text-amber-500 font-semibold">{newlyUnlockedReward?.animal.rarity}</span>
          </div>
          <AlertDialogFooter>
              <AlertDialogAction onClick={() => { setNewlyUnlockedReward(null); setView('sanctuary'); }} className="bg-accent text-accent-foreground hover:bg-accent/90 w-full">
                ¡Genial! Ver en mi Santuario
              </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
