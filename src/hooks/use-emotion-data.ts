"use client";

import { useState, useEffect } from 'react';
import { useFirebase, useUser, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc, writeBatch, query, where, getDocs } from 'firebase/firestore';
import type { Emotion, DiaryEntry, UserProfile, Reward } from '@/lib/types';
import { deleteDocumentNonBlocking, setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
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
        case 'special':
            if (reward.id === 'phoenix-reward') {
                // This is handled in handleQuizComplete
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

  // --- Data Mutation Functions ---
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

  // Check rewards whenever data changes
  useEffect(() => {
    if (userProfile && diaryEntries && emotionsList) {
      checkAndUnlockRewards(userProfile, diaryEntries, emotionsList);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile, diaryEntries, emotionsList]);

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
    setNewlyUnlockedReward
  };
}
