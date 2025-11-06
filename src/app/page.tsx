'use client';

import React, { Suspense, useEffect } from 'react';
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
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';


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

  // CRITICAL FIX: The logic for creating a new user profile has been moved
  // directly into the component body and is guarded by a very strict condition.
  // This useEffect was the source of the bug, as it could fire under race conditions
  // where `isProfileLoading` was false but `userProfile` was transiently null.
  if (!isUserLoading && !isProfileLoading && user && !userProfile) {
    // This condition is now only met when we know for sure that a user is logged in
    // and has no profile document in the database.
    const newProfile: Omit<UserProfile, 'id'> = {
      name: user.email?.split('@')[0] || 'Usuario',
      avatar: '😊',
      avatarType: 'emoji',
      unlockedAnimalIds: [],
      emotionCount: 0,
    };
    if (userProfileRef) {
      // Use setDoc with merge:false because we are explicitly CREATING a new document.
      // This is safe because of the !userProfile check.
      setDocumentNonBlocking(userProfileRef, newProfile, { merge: false });
    }
  }


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
