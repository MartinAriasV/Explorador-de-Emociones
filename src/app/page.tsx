'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import EmotionExplorer from '@/app/components/emotion-explorer';
import {
  FirebaseClientProvider,
  useUser,
  useFirestore,
  useDoc,
  useMemoFirebase,
} from '@/firebase';
import type { UserProfile } from '@/lib/types';
import type { User } from 'firebase/auth';

const defaultProfile: Omit<UserProfile, 'id' | 'unlockedAnimalIds' | 'emotionCount'> = {
  name: 'Usuario',
  avatar: '😊',
  avatarType: 'emoji',
};

// This component now handles the logic for checking/creating a profile
// and then rendering the main application.
function AppGate() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  
  const userProfileRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);
  
  useEffect(() => {
    // This effect runs when auth and profile loading states change.
    // It's responsible for creating a profile for a new user.
    if (isUserLoading || isProfileLoading) {
      // If we are still loading, do nothing and wait for the next run.
      return;
    }

    // This is the critical condition:
    // ONLY create a profile if loading is complete, we have a user, and there is NO profile.
    if (user && !userProfile) {
      const newProfile: UserProfile = {
        id: user.uid,
        name: user.email?.split('@')[0] || defaultProfile.name,
        avatar: defaultProfile.avatar,
        avatarType: defaultProfile.avatarType,
        unlockedAnimalIds: [],
        emotionCount: 0,
      };
      
      if (userProfileRef) {
        // This will only run ONCE for a new user. For existing users, `userProfile` will be defined.
        setDoc(userProfileRef, newProfile).catch(console.error);
      }
    }
  }, [user, isUserLoading, isProfileLoading, userProfile, userProfileRef]);


  if (isUserLoading || (user && isProfileLoading)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center flex-col gap-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg text-primary">Cargando...</p>
      </div>
    );
  }

  // A new user is determined by having a profile but no unlocked animals yet.
  // This is more reliable than a temporary state flag.
  const isNewUser = !!userProfile && (!userProfile.unlockedAnimalIds || userProfile.unlockedAnimalIds.length === 0);

  // Pass a key to EmotionExplorer to ensure it remounts if the user changes,
  // and pass the isNewUser flag to trigger the welcome tour.
  return <EmotionExplorer key={user?.uid} isNewUser={isNewUser} />;
}

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <FirebaseClientProvider>
        {/* Suspense is a good practice for components with async data */}
        <Suspense
          fallback={
            <div className="flex h-screen w-screen items-center justify-center">
              Cargando...
            </div>
          }
        >
          <AppGate />
        </Suspense>
      </FirebaseClientProvider>
    </main>
  );
}
