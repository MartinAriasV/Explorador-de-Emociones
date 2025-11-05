"use client";

import React, { useState, useRef, createRef, useEffect } from 'react';
import type { Emotion, DiaryEntry, UserProfile, View, PredefinedEmotion, TourStepData } from '@/lib/types';
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
import { WelcomeDialog } from './tour/welcome-dialog';
import { TourPopup } from './tour/tour-popup';
import { TOUR_STEPS } from '@/lib/constants';
import { useFirebase, useUser, useCollection, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { deleteDocumentNonBlocking, setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, doc, setDoc } from 'firebase/firestore';
import LoginView from './views/login-view';
import useLocalStorage from '@/hooks/use-local-storage';
import { StreakView } from './views/streak-view';

export default function EmotionExplorer() {
  const [view, setView] = useState<View>('diary');
  const { firestore } = useFirebase();
  const { user, isUserLoading } = useUser();

  // --- Firestore Data ---
  const userProfileRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userProfile, isLoading: isProfileLoading, error: profileError } = useDoc<UserProfile>(userProfileRef);

  const emotionsQuery = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'emotions') : null, [firestore, user]);
  const { data: emotionsList, isLoading: isLoadingEmotions } = useCollection<Emotion>(emotionsQuery);
  
  const diaryEntriesQuery = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'diaryEntries') : null, [firestore, user]);
  const { data: diaryEntries, isLoading: isLoadingEntries } = useCollection<DiaryEntry>(diaryEntriesQuery);
  // --------------------

  const [addingEmotionData, setAddingEmotionData] = useState<Partial<Emotion> & { id?: string } | null>(null);

  // Tour state
  const [showWelcome, setShowWelcome] = useLocalStorage('emotion-explorer-show-welcome', true);
  const [tourStep, setTourStep] = useState(0);

  // Refs for the tour
  const tourRefs = TOUR_STEPS.reduce((acc, step) => {
    acc[step.refKey] = createRef<HTMLLIElement>();
    return acc;
  }, {} as { [key: string]: React.RefObject<HTMLLIElement> });

  // This effect handles the initial creation of a user profile document in Firestore.
  // It only runs when a user is authenticated, the profile loading is complete,
  // and it's confirmed that no profile document exists.
  useEffect(() => {
    if (user && userProfileRef && !isProfileLoading && !userProfile) {
      const newUserProfile: UserProfile = {
        name: user.displayName || 'Usuario',
        avatar: user.photoURL || '😊',
        avatarType: user.photoURL ? 'generated' : 'emoji',
      };
      // This is a non-blocking write. It ensures that if the user navigates away
      // or closes the app, the creation request is still sent.
      setDocumentNonBlocking(userProfileRef, newUserProfile, { merge: false });
    }
  }, [user, userProfile, isProfileLoading, userProfileRef]);
  
  const setUserProfile = (profile: Omit<UserProfile, 'id'>) => {
    if (!userProfileRef) return;
    // Use `setDoc` with merge to either create or update the document.
    // This is a non-blocking write.
    setDocumentNonBlocking(userProfileRef, profile, { merge: true });
  }

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
  
  const deleteEmotion = (emotionId: string) => {
    if (!user) return;
    const emotionDoc = doc(firestore, 'users', user.uid, 'emotions', emotionId);
    deleteDocumentNonBlocking(emotionDoc);
    setAddingEmotionData(null); // Close modal if it was open
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
        return <StreakView diaryEntries={diaryEntries || []} />;
      case 'report':
        return <ReportView diaryEntries={diaryEntries || []} emotionsList={emotionsList || []} />;
      case 'share':
        return <ShareView diaryEntries={diaryEntries || []} emotionsList={emotionsList || []} userProfile={userProfile!} />;
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
  };
  
  if (isUserLoading) {
    return <div className="flex h-screen w-screen items-center justify-center">Cargando...</div>;
  }

  if (!user) {
    return <LoginView />;
  }
  
  if (isProfileLoading) {
     return <div className="flex h-screen w-screen items-center justify-center">Cargando perfil...</div>;
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
    </SidebarProvider>
  );
}
