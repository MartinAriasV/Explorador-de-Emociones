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
