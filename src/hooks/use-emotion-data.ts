"use client";

import { useState, useCallback } from 'react';
import { useFirebase, useUser, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc, writeBatch, query, where, getDocs } from 'firebase/firestore';
import type { Emotion, DiaryEntry, UserProfile, Reward } from '@/lib/types';
import { deleteDocumentNonBlocking, addDocumentToCollectionNonBlocking, updateDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { calculateDailyStreak } from '@/lib/utils';
import { REWARDS } from '@/lib/constants';

export function useEmotionData() {
  const { firestore } = useFirebase();
  const { user } = useUser();

  // --- Firestore Data ---
  const userProfileRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [firestore, user]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const emotionsQuery = useMemoFirebase(() => (user ? collection(firestore, 'users', user.uid, 'emotions') : null), [firestore, user]);
  const { data: emotionsList, isLoading: areEmotionsLoading } = useCollection<Emotion>(emotionsQuery);
  
  const diaryEntriesQuery = useMemoFirebase(() => (user ? collection(firestore, 'users', user.uid, 'diaryEntries') : null), [firestore, user]);
  const { data: diaryEntries, isLoading: areDiaryEntriesLoading } = useCollection<DiaryEntry>(diaryEntriesQuery);

  const [newlyUnlockedReward, setNewlyUnlockedReward] = useState<Reward | null>(null);

  const isLoading = isProfileLoading || areEmotionsLoading || areDiaryEntriesLoading;
  
  // --- Reward Logic ---
  const checkAndUnlockRewards = useCallback((
    trigger: 'addEntry' | 'addEmotion' | 'share' | 'recoverDay', 
    currentProfile: UserProfile, 
    currentDiaryEntries: DiaryEntry[], 
    currentEmotions: Emotion[]
  ) => {
      if (!currentProfile || !userProfileRef) return;
    
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
          case 'entry_count':
            if (trigger === 'addEntry' || trigger === 'recoverDay') {
               unlocked = reward.type === 'streak' ? dailyStreak >= reward.value : entryCount >= reward.value;
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
    
      if (newUnlockedIds.length > (currentProfile.unlockedAnimalIds?.length || 0)) {
        // CRITICAL FIX: Only update the unlockedAnimalIds field.
        // This prevents overwriting the user's name and avatar.
        updateDocumentNonBlocking(userProfileRef, { unlockedAnimalIds: newUnlockedIds });
        if (justUnlockedReward) {
          setNewlyUnlockedReward(justUnlockedReward);
        }
      }
  }, [userProfileRef]);

  const handleShare = () => {
    if (!userProfile || !diaryEntries || !emotionsList) return;
    checkAndUnlockRewards('share', userProfile, diaryEntries, emotionsList);
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

  // --- Data Mutation Functions ---
  const setUserProfile = (profile: Partial<Omit<UserProfile, 'id'>>) => {
    if (!userProfileRef) return;
    // CRITICAL FIX: Use updateDocumentNonBlocking to only update fields, not overwrite the document.
    // This prevents accidental deletion of other profile fields.
    updateDocumentNonBlocking(userProfileRef, profile);
  };

  const saveEmotion = (emotionData: Omit<Emotion, 'id' | 'userProfileId'> & { id?: string }) => {
    if (!user || !userProfile || !diaryEntries || !emotionsList) return;
    const emotionsCollection = collection(firestore, 'users', user.uid, 'emotions');
    
    const isNew = !emotionData.id;

    const promise = emotionData.id
      ? updateDocumentNonBlocking(doc(emotionsCollection, emotionData.id), { ...emotionData, userProfileId: user.uid })
      : addDocumentToCollectionNonBlocking(emotionsCollection, { ...emotionData, userProfileId: user.uid });
    
    if (isNew) {
        promise.then(() => {
            // We need to fetch the latest data to check rewards accurately
            const updatedEmotions = [...emotionsList, { ...emotionData, id: 'temp-id', userProfileId: user.uid } as Emotion];
            checkAndUnlockRewards('addEmotion', userProfile, diaryEntries || [], updatedEmotions);
        });
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

  const addDiaryEntry = (entryData: Omit<DiaryEntry, 'id' | 'userProfileId'>, trigger: 'addEntry' | 'recoverDay' = 'addEntry') => {
    if (!user || !userProfile || !emotionsList || !diaryEntries) return;
    const diaryCollection = collection(firestore, 'users', user.uid, 'diaryEntries');
    addDocumentToCollectionNonBlocking(diaryCollection, { ...entryData, userProfileId: user.uid })
      .then(() => {
        // After adding the entry, get the most up-to-date data to check rewards
        const newEntry = { ...entryData, id: 'temp-id', userProfileId: user.uid } as DiaryEntry;
        const updatedDiaryEntries = [...(diaryEntries || []), newEntry];
        checkAndUnlockRewards(trigger, userProfile, updatedDiaryEntries, emotionsList);
      });
  };
  
  const updateDiaryEntry = (updatedEntry: DiaryEntry) => {
    if (!user) return;
    const entryDoc = doc(firestore, 'users', user.uid, 'diaryEntries', updatedEntry.id);
    updateDocumentNonBlocking(entryDoc, updatedEntry);
  };
  
  const deleteDiaryEntry = (entryId: string) => {
    if (!user) return;
    const entryDoc = doc(firestore, 'users', user.uid, 'diaryEntries', entryId);
    deleteDocumentNonBlocking(entryDoc);
  };

  return {
    userProfile,
    emotionsList,
    diaryEntries,
    newlyUnlockedReward,
    isLoading,
    setUserProfile,
    addDiaryEntry,
    updateDiaryEntry,
    deleteDiaryEntry,
    saveEmotion,
    deleteEmotion,
    handleShare,
    setNewlyUnlockedReward,
    handleQuizComplete,
  };
}
