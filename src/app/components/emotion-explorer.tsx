"use client";

import React, { useState, useRef, createRef } from 'react';
import type { Emotion, DiaryEntry, UserProfile, View, PredefinedEmotion, TourStepData } from '@/lib/types';
import useLocalStorage from '@/hooks/use-local-storage';
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

export default function EmotionExplorer() {
  const [view, setView] = useState<View>('diary');
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile>('emotion-explorer-profile', { name: 'Usuario', avatar: '😊', avatarType: 'emoji' });
  const [emotionsList, setEmotionsList] = useLocalStorage<Emotion[]>('emotion-explorer-emotions', []);
  const [diaryEntries, setDiaryEntries] = useLocalStorage<DiaryEntry[]>('emotion-explorer-entries', []);
  const [addingEmotionData, setAddingEmotionData] = useState<(Omit<PredefinedEmotion, 'example'> & { id?: string }) | null>(null);

  // Tour state
  const [showWelcome, setShowWelcome] = useLocalStorage('emotion-explorer-show-welcome', true);
  const [tourStep, setTourStep] = useState(0);

  // Refs for the tour
  const tourRefs = TOUR_STEPS.reduce((acc, step) => {
    acc[step.refKey] = createRef<HTMLLIElement>();
    return acc;
  }, {} as { [key: string]: React.RefObject<HTMLLIElement> });


  const saveEmotion = (emotionData: Omit<Emotion, 'id'> & { id?: string }) => {
    if (emotionData.id) {
      // Editing existing emotion
      setEmotionsList(emotionsList.map(e => e.id === emotionData.id ? { ...e, ...emotionData } as Emotion : e));
    } else {
      // Adding new emotion
      const newEmotion = { ...emotionData, id: Date.now().toString() } as Emotion;
      setEmotionsList([...emotionsList, newEmotion]);
    }
    setAddingEmotionData(null);
  };
  
  const deleteEmotion = (emotionId: string) => {
    setEmotionsList(emotionsList.filter(e => e.id !== emotionId));
    // Also remove diary entries associated with this emotion
    setDiaryEntries(diaryEntries.filter(entry => entry.emotionId !== emotionId));
    setAddingEmotionData(null); // Close modal if it was open
  };

  const addDiaryEntry = (entryData: Omit<DiaryEntry, 'id'>) => {
    const newEntry = { ...entryData, id: Date.now().toString() };
    setDiaryEntries([...diaryEntries, newEntry]);
  };
  
  const updateDiaryEntry = (updatedEntry: DiaryEntry) => {
    setDiaryEntries(diaryEntries.map(entry => entry.id === updatedEntry.id ? updatedEntry : entry));
  };
  
  const deleteDiaryEntry = (entryId: string) => {
    setDiaryEntries(diaryEntries.filter(entry => entry.id !== entryId));
  };


  const handleOpenAddEmotionModal = (emotionData: (Omit<PredefinedEmotion, 'example'> & { id?: string })) => {
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
                  emotionsList={emotionsList} 
                  diaryEntries={diaryEntries} 
                  addDiaryEntry={addDiaryEntry}
                  updateDiaryEntry={updateDiaryEntry}
                  deleteDiaryEntry={deleteDiaryEntry}
                  setView={setView} 
                />;
      case 'emocionario':
        return <EmocionarioView emotionsList={emotionsList} addEmotion={saveEmotion} onEditEmotion={handleOpenAddEmotionModal} onDeleteEmotion={deleteEmotion} />;
      case 'discover':
        return <DiscoverView onAddEmotion={handleOpenAddEmotionModal} />;
      case 'calm':
        return <CalmView />;
      case 'report':
        return <ReportView diaryEntries={diaryEntries} emotionsList={emotionsList} />;
      case 'share':
        return <ShareView diaryEntries={diaryEntries} emotionsList={emotionsList} userProfile={userProfile} />;
      case 'profile':
        return <ProfileView userProfile={userProfile} setUserProfile={setUserProfile} />;
      default:
        return <DiaryView 
                  emotionsList={emotionsList} 
                  diaryEntries={diaryEntries} 
                  addDiaryEntry={addDiaryEntry}
                  updateDiaryEntry={updateDiaryEntry}
                  deleteDiaryEntry={deleteDiaryEntry}
                  setView={setView} 
                />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen bg-background">
        <AppSidebar view={view} setView={setView} userProfile={userProfile} refs={tourRefs} />
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="p-2 md:hidden flex items-center border-b">
             <MobileMenuButton />
             <h1 className="text-lg font-bold text-primary ml-2">Emotion Explorer</h1>
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
