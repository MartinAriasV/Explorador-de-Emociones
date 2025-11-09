'use client';

import React, { Suspense, useEffect, useState } from 'react';
import EmotionExplorer from '@/app/components/emotion-explorer';
import {
  FirebaseClientProvider,
  useUser,
} from '@/firebase';
import LoginView from './components/views/login-view';
import { useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { UserProfile, ShopItem } from '@/lib/types';
import { SHOP_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import useLocalStorage from '@/hooks/use-local-storage';

function AppBody({ className, children }: { className: string, children: React.ReactNode }) {
  useEffect(() => {
    document.body.className = cn('font-body antialiased h-full', className);
  }, [className]);
  return <>{children}</>;
}


function AppGate() {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  const [theme] = useLocalStorage<'dark' | 'light'>('theme', 'light');

  const userProfileRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [firestore, user]);
  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  const bodyClassName = useMemo(() => {
    const equippedThemeId = userProfile?.equippedItems?.['theme'];
    const themeItem = SHOP_ITEMS.find(item => item.id === equippedThemeId && item.type === 'theme');
    
    const classes = ['bg-background', theme];
    if (themeItem?.value === 'theme-forest') {
        classes.push('bg-forest-gradient');
        classes.push('theme-forest');
    } else if (themeItem) {
        classes.push(themeItem.value);
    }

    return cn(classes);
  }, [userProfile, theme]);


  if (isUserLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center flex-col gap-4 bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg text-primary">Cargando...</p>
      </div>
    );
  }
  
  if (!user) {
    return (
       <AppBody className={cn(theme, 'bg-background')}>
         <LoginView />
       </AppBody>
    );
  }
  
  return (
    <AppBody className={bodyClassName}>
        <EmotionExplorer user={user} />
    </AppBody>
  );
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
