"use client";

import { useState, useCallback, useMemo } from 'react';
import { useFirebase, useCollection, useDoc } from '@/firebase';
import { collection, doc, writeBatch, query, where, getDocs, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import type { Emotion, DiaryEntry, UserProfile, Reward } from '@/lib/types';
import { addDocumentToCollectionNonBlocking } from '@/firebase/non-blocking-updates';
import { calculateDailyStreak } from '@/lib/utils';
import { REWARDS } from '@/lib/constants';
import type { User } from 'firebase/auth';

export function useEmotionData(user: User | null) {
  const { firestore } = useFirebase();

  // --- Firestore Data Hooks ---
  const userProfileRef = useMemo(() => (user ? doc(firestore, 'users', user.uid) : null), [firestore, user]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const emotionsQuery = useMemo(() => (user ? collection(firestore, 'users', user.uid, 'emotions') : null), [firestore, user]);
  const { data: emotionsList, isLoading: areEmotionsLoading } = useCollection<Emotion>(emotionsQuery);
  
  const diaryEntriesQuery = useMemo(() => (user ? collection(firestore, 'users', user.uid, 'diaryEntries') : null), [firestore, user]);
  const { data: diaryEntries, isLoading: areDiaryEntriesLoading } = useCollection<DiaryEntry>(diaryEntriesQuery);

  const [newlyUnlockedReward, setNewlyUnlockedReward] = useState<Reward | null>(null);

  const isLoading = isProfileLoading || areEmotionsLoading || areDiaryEntriesLoading;
  
  // --- Profile Creation Logic ---
  const addProfileIfNotExists = useCallback(async (): Promise<boolean> => {
    if (!user || !userProfileRef) return false;
  
    const docSnap = await getDoc(userProfileRef);
    if (!docSnap.exists()) {
      console.log("No profile found for user, creating one...");
      const newProfile: Omit<UserProfile, 'id'> = {
        name: user.email?.split('@')[0] || 'Usuario',
        avatar: '😊',
        avatarType: 'emoji',
        unlockedAnimalIds: [],
      };
      await setDoc(userProfileRef, newProfile);
      return true; // Indicates a new user was created
    }
    return false; // Indicates user already existed
  }, [user, userProfileRef]);


  // --- Reward Logic ---
  const checkAndUnlockRewards = useCallback(async (
    trigger: 'addEntry' | 'addEmotion' | 'share' | 'recoverDay'
  ) => {
      if (!userProfileRef) return;

      // Get the most up-to-date data directly from Firestore to avoid state inconsistencies
      const freshProfileSnap = await getDoc(userProfileRef);
      const freshProfile = freshProfileSnap.data() as UserProfile;
      const diaryEntriesCollection = collection(firestore, 'users', user!.uid, 'diaryEntries');
      const emotionsCollection = collection(firestore, 'users', user!.uid, 'emotions');

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
        await updateDoc(userProfileRef, { unlockedAnimalIds: newUnlockedIds });
        if (justUnlockedReward) {
          setNewlyUnlockedReward(justUnlockedReward);
        }
      }
  }, [user, firestore, userProfileRef]);

  const handleShare = () => {
    checkAndUnlockRewards('share');
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
  const setUserProfile = async (profile: Partial<Omit<UserProfile, 'id'>>) => {
    if (!userProfileRef) return;
    // Use updateDoc for safe, non-destructive updates.
    await updateDoc(userProfileRef, profile);
  };

  const saveEmotion = async (emotionData: Omit<Emotion, 'id' | 'userProfileId'> & { id?: string }) => {
    if (!user) return;
    const emotionsCollection = collection(firestore, 'users', user.uid, 'emotions');
    
    const isNew = !emotionData.id;

    if (emotionData.id) {
      await updateDoc(doc(emotionsCollection, emotionData.id), { ...emotionData, userProfileId: user.uid });
    } else {
      await addDocumentToCollectionNonBlocking(emotionsCollection, { ...emotionData, userProfileId: user.uid });
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

  const addDiaryEntry = async (entryData: Omit<DiaryEntry, 'id' | 'userProfileId'>, trigger: 'addEntry' | 'recoverDay' = 'addEntry') => {
    if (!user) return;
    const diaryCollection = collection(firestore, 'users', user.uid, 'diaryEntries');
    await addDocumentToCollectionNonBlocking(diaryCollection, { ...entryData, userProfileId: user.uid });
    await checkAndUnlockRewards(trigger);
  };
  
  const updateDiaryEntry = async (updatedEntry: DiaryEntry) => {
    if (!user) return;
    const entryDoc = doc(firestore, 'users', user.uid, 'diaryEntries', updatedEntry.id);
    await updateDoc(entryDoc, { ...updatedEntry });
  };
  
  const deleteDiaryEntry = async (entryId: string) => {
    if (!user) return;
    const entryDoc = doc(firestore, 'users', user.uid, 'diaryEntries', entryId);
    await deleteDoc(entryDoc);
  };

  return {
    user,
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
    addProfileIfNotExists,
  };
}
