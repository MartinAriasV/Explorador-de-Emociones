import EmotionExplorer from '@/app/components/emotion-explorer';
import { FirebaseClientProvider } from '@/firebase';

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <FirebaseClientProvider>
        <EmotionExplorer />
      </FirebaseClientProvider>
    </main>
  );
}
