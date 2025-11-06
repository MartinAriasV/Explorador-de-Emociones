"use client";

import { useState, useCallback, useMemo } from 'react';
import { useFirebase, useCollection, useDoc } from '@/firebase';
import { collection, doc, writeBatch, query, where, getDocs } from 'firebase/firestore';
import type { Emotion, DiaryEntry, UserProfile, Reward } from '@/lib/types';
import { deleteDocumentNonBlocking, addDocumentToCollectionNonBlocking, updateDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { calculateDailyStreak } from '@/lib/utils';
import { REWARDS } from '@/lib/constants';
import type { User } from 'firebase/auth';

export function useEmotionData(user: User | null) {
  const { firestore } = useFirebase();

  // --- Firestore Data ---
  const userProfileRef = useMemo(() => (user ? doc(firestore, 'users', user.uid) : null), [firestore, user]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const emotionsQuery = useMemo(() => (user ? collection(firestore, 'users', user.uid, 'emotions') : null), [firestore, user]);
  const { data: emotionsList, isLoading: areEmotionsLoading } = useCollection<Emotion>(emotionsQuery);
  
  const diaryEntriesQuery = useMemo(() => (user ? collection(firestore, 'users', user.uid, 'diaryEntries') : null), [firestore, user]);
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
             if (trigger === 'addEntry' || trigger === 'recoverDay') {
               unlocked = dailyStreak >= reward.value;
             }
             break;
          case 'entry_count':
            if (trigger === 'addEntry' || trigger === 'recoverDay') {
                if (entryCount === 1 && reward.id === 'entry-1') { 
                    unlocked = true;
                } else {
                    unlocked = entryCount >= reward.value;
                }
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
  const addProfileIfNotExists = useCallback((user: User) => {
    if (!user) return;
    const newProfile: Omit<UserProfile, 'id'> = {
        name: user.email?.split('@')[0] || 'Usuario',
        avatar: '😊',
        avatarType: 'emoji',
        unlockedAnimalIds: [],
    };
    const ref = doc(firestore, 'users', user.uid);
    // Use merge: false to ensure it only creates, not overwrites.
    // Firestore's setDoc with merge:false on a non-existent doc is a create operation.
    setDocumentNonBlocking(ref, newProfile, { merge: false });
  }, [firestore]);
  
  const setUserProfile = (profile: Partial<Omit<UserProfile, 'id'>>) => {
    if (!userProfileRef) return;
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
    user,
    userProfile,
    emotionsList,
    diaryEntries,
    newlyUnlockedReward,
    isLoading,
    addProfileIfNotExists,
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
