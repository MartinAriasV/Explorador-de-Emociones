'use client';

import React, { Suspense, useEffect } from 'react';
import EmotionExplorer from '@/app/components/emotion-explorer';
import {
  FirebaseClientProvider,
  useDoc,
  useMemoFirebase,
  useUser,
} from '@/firebase';
import LoginView from './components/views/login-view';
import useLocalStorage from '@/hooks/use-local-storage';
import { doc } from 'firebase/firestore';
import { useFirebase } from '@/firebase/provider';
import type { UserProfile } from '@/lib/types';
import { SHOP_ITEMS } from '@/lib/constants';

function AppGate() {
  const { user, isUserLoading } = useUser();
  const [theme] = useLocalStorage<'dark' | 'light'>('theme', 'light');
  const { firestore } = useFirebase();

  const userProfileRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [firestore, user]);
  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const body = document.body;
    const root = document.documentElement;
    
    // Always manage light/dark mode
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    const equippedThemeId = userProfile?.equippedItems?.['theme'];
    const themeItem = SHOP_ITEMS.find(item => item.id === equippedThemeId && item.type === 'theme');

    if (themeItem && themeItem.value === 'theme-forest') {
      body.classList.add('bg-forest-gradient');
      body.classList.remove('bg-background');
    } else {
      body.classList.remove('bg-forest-gradient');
      body.classList.add('bg-background');
    }

    // Cleanup on unmount
    return () => {
      body.classList.remove('bg-forest-gradient');
      body.classList.add('bg-background');
    };
  }, [theme, userProfile]);


  if (isUserLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center flex-col gap-4 bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg text-primary">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }
  
  return <EmotionExplorer user={user} />;
}

export default function Home() {
  return (
    <main>
      <FirebaseClientProvider>
        <Suspense
          fallback={
            <div className="flex h-screen w-screen items-center justify-center bg-background">
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
