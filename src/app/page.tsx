'use client';

import React, { Suspense, useEffect } from 'react';
import EmotionExplorer from '@/app/components/emotion-explorer';
import {
  FirebaseClientProvider,
  useUser,
  useDoc,
  useMemoFirebase,
} from '@/firebase';
import LoginView from './components/views/login-view';
import { doc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import type { UserProfile } from '@/lib/types';
import { SHOP_ITEMS } from '@/lib/constants';

function AppGate() {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();

  const userProfileRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [firestore, user]);
  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  useEffect(() => {
    const equippedThemeId = userProfile?.equippedItems?.['theme'];
    const themeItem = SHOP_ITEMS.find(item => item.id === equippedThemeId && item.type === 'theme');
    const isForestTheme = themeItem?.value === 'theme-forest';

    if (isForestTheme) {
      document.body.classList.add('bg-forest-gradient');
      document.body.classList.remove('bg-background');
    } else {
      document.body.classList.remove('bg-forest-gradient');
      document.body.classList.add('bg-background');
    }

    return () => {
      document.body.classList.remove('bg-forest-gradient');
      document.body.classList.add('bg-background');
    };
  }, [userProfile]);


  if (isUserLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center flex-col gap-4 bg-transparent">
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
    <main className="bg-transparent">
      <FirebaseClientProvider>
        <Suspense
          fallback={
            <div className="flex h-screen w-screen items-center justify-center bg-transparent">
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
