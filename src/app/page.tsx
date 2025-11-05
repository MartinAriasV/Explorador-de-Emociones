import EmotionExplorer from '@/app/components/emotion-explorer';
import { FirebaseClientProvider, useUser, useFirestore } from '@/firebase';
import { Suspense } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';

const defaultProfile: Omit<UserProfile, 'id' | 'unlockedAnimalIds' | 'emotionCount'> = {
  name: 'Usuario',
  avatar: '😊',
  avatarType: 'emoji',
};

// This component acts as a gate to ensure the user profile exists before rendering the app.
function ProfileGate() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  // We pass a key to EmotionExplorer to force a re-render when isNewUser changes.
  // This ensures the component re-evaluates its initial state.
  if (user) {
    const userProfileRef = doc(firestore, 'users', user.uid);
    return (
      <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center">Cargando...</div>}>
        <CheckAndCreateProfile user={user} userProfileRef={userProfileRef} firestore={firestore} />
      </Suspense>
    );
  }

  // If there's no user, and we are not loading, show the login view (which is inside EmotionExplorer)
  if (!user && !isUserLoading) {
    return <EmotionExplorer isNewUser={false} />;
  }

  // Otherwise, show a loading screen while auth state is being determined.
  return <div className="flex h-screen w-screen items-center justify-center">Cargando...</div>;
}

async function checkAndCreateProfile(user: any, userProfileRef: any, firestore: any): Promise<boolean> {
  const profileSnap = await getDoc(userProfileRef);
  if (!profileSnap.exists()) {
    const newProfile: UserProfile = {
      id: user.uid,
      name: user.email?.split('@')[0] || defaultProfile.name,
      avatar: defaultProfile.avatar,
      avatarType: defaultProfile.avatarType,
      unlockedAnimalIds: [],
      emotionCount: 0,
    };
    await setDoc(userProfileRef, newProfile, { merge: true });
    return true; // Is a new user
  }
  return false; // Is an existing user
}

function CheckAndCreateProfile({ user, userProfileRef, firestore }: any) {
  const promise = checkAndCreateProfile(user, userProfileRef, firestore);

  // This is a pattern to use async operations in server components.
  // It's not ideal, but it's a way to bridge the gap.
  const [isNewUser, setIsNewUser] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    promise.then(setIsNewUser);
  }, [promise]);

  if (isNewUser === null) {
    return <div className="flex h-screen w-screen items-center justify-center">Verificando perfil...</div>;
  }

  return <EmotionExplorer key={user.uid} isNewUser={isNewUser} />;
}


export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <FirebaseClientProvider>
        <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center">Cargando...</div>}>
          <ProfileGate />
        </Suspense>
      </FirebaseClientProvider>
    </main>
  );
}
