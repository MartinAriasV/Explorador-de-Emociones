'use client';

import React, { Suspense, useMemo } from 'react';
import EmotionExplorer from '@/app/components/emotion-explorer';
import {
  FirebaseClientProvider,
  useUser,
  useDoc
} from '@/firebase';
import LoginView from './components/views/login-view';
import { doc }from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { UserProfile } from '@/lib/types';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';


function AppGate() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemo(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  // This effect will run ONCE when the profile is loaded for the first time,
  // or when the user changes. It ensures a profile exists.
  React.useEffect(() => {
    // We only act when we have a user and the profile loading has finished.
    if (user && !isProfileLoading) {
      // If after loading, there is definitively no profile, we create one.
      if (!userProfile) {
        console.log("No profile found for user, creating one...");
        const newProfile: Omit<UserProfile, 'id'> = {
            name: user.email?.split('@')[0] || 'Usuario',
            avatar: '😊',
            avatarType: 'emoji',
            unlockedAnimalIds: [],
        };
        // Use the memoized ref to ensure we're writing to the correct location.
        if (userProfileRef) {
          setDocumentNonBlocking(userProfileRef, newProfile, { merge: false });
        }
      }
    }
  }, [user, userProfile, isProfileLoading, userProfileRef]);


  if (isUserLoading || isProfileLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center flex-col gap-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg text-primary">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }
  
  // Do not render the main app until we have a profile object.
  // The useEffect above will create one if it's missing. The `useDoc` hook
  // will then pick it up, `isProfileLoading` will become false, and `userProfile` will be populated,
  // causing a re-render that passes this check.
  if (!userProfile) {
     return (
      <div className="flex h-screen w-screen items-center justify-center flex-col gap-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg text-primary">Creando perfil...</p>
      </div>
    );
  }

  // Pass a key and the user object to EmotionExplorer.
  // This ensures it remounts if the user changes and has the user data immediately.
  return <EmotionExplorer key={user.uid} user={user} initialProfile={userProfile} />;
}

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <FirebaseClientProvider>
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
