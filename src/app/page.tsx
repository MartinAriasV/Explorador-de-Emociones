import EmotionExplorer from '@/app/components/emotion-explorer';
import { FirebaseClientProvider } from '@/firebase';
import { Suspense } from 'react';

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <FirebaseClientProvider>
        <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center">Cargando...</div>}>
          <EmotionExplorer />
        </Suspense>
      </FirebaseClientProvider>
    </main>
  );
}
