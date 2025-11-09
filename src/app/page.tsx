'use client';

import React, { Suspense, useEffect, useMemo } from 'react';
import EmotionExplorer from '@/app/components/emotion-explorer';
import {
  FirebaseClientProvider,
  useUser,
  useDoc,
  useMemoFirebase,
} from '@/firebase';
import LoginView from './components/views/login-view';
import type { UserProfile } from '@/lib/types';
import { doc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { SHOP_ITEMS } from '@/lib/constants';
import useLocalStorage from '@/hooks/use-local-storage';

function AppGate() {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  const userProfileRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [firestore, user]);
  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('theme', 'light');

  const bodyClassName = useMemo(() => {
    if (!userProfile) return theme; // Return base theme if no profile

    const equippedThemeId = userProfile.equippedItems?.['theme'];
    const themeItem = SHOP_ITEMS.find(item => item.id === equippedThemeId && item.type === 'theme');
    
    const classes = [theme];
    if (themeItem) {
      classes.push(themeItem.value); // e.g., 'theme-forest'
      if (themeItem.value === 'theme-forest') {
        classes.push('bg-forest-gradient');
      } else {
        classes.push('bg-background');
      }
    } else {
      classes.push('bg-background');
    }
    return classes.join(' ');
  }, [userProfile, theme]);

  useEffect(() => {
    document.body.className = bodyClassName;
  }, [bodyClassName]);


  if (isUserLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center flex-col gap-4 bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg text-primary">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    document.body.className = 'bg-background'; // Ensure login view has a background
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
