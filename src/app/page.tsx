'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { doc } from 'firebase/firestore';
import EmotionExplorer from '@/app/components/emotion-explorer';
import {
  FirebaseClientProvider,
  useUser,
  useFirestore,
  useDoc,
  useMemoFirebase,
} from '@/firebase';
import type { UserProfile } from '@/lib/types';
import { useEmotionData } from '@/hooks/use-emotion-data';


// This component now handles the logic for checking/creating a profile
// and then rendering the main application.
function AppGate() {
  const { user, isUserLoading } = useUser();
  const { addProfileIfNotExists } = useEmotionData();
  
  const userProfileRef = useMemoFirebase(
    () => (user ? doc(useFirestore(), 'users', user.uid) : null),
    [user]
  );
  
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);
  
  useEffect(() => {
    // This effect runs only when the necessary data is available and confirmed.
    // It creates a profile ONLY IF:
    // 1. All loading is done.
    // 2. We have an authenticated user.
    // 3. The result of that check is that the profile is null (doesn't exist).
    if (!isUserLoading && !isProfileLoading && user && !userProfile) {
      addProfileIfNotExists(user);
    }
  }, [isUserLoading, isProfileLoading, user, userProfile, addProfileIfNotExists]);

  if (isUserLoading || (user && isProfileLoading)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center flex-col gap-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg text-primary">Cargando...</p>
      </div>
    );
  }

  // A new user is determined by having a profile but no unlocked animals yet.
  // This is passed to EmotionExplorer which will decide if the tour should start.
  const isNewUser = !!userProfile && (!userProfile.unlockedAnimalIds || userProfile.unlockedAnimalIds.length === 0);

  // Pass a key to EmotionExplorer to ensure it remounts if the user changes.
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
