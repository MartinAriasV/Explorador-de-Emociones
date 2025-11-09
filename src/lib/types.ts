export type Emotion = {
  id: string;
  userId: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  isCustom: boolean;
};

export type DiaryEntry = {
  id: string;
  userId: string;
  date: string;
  emotionId: string;
  text: string;
};

export type UserProfile = {
  id: string; // Firestore ID, matches auth UID
  name: string;
  email: string;
  avatar: string; // Can be an emoji or a URL for generated avatar
  avatarType: 'emoji' | 'generated';
  unlockedAnimalIds?: string[];
  entryCount?: number;
  emotionCount?: number;
  lastEntryDate?: string;
  currentStreak?: number;
};

export type View = 'diary' | 'emocionario' | 'discover' | 'calm' | 'report' | 'share' | 'profile' | 'streak' | 'sanctuary' | 'games';

export type PredefinedEmotion = {
  name: string;
  icon: string;
  description: string;
  example: string;
  color: string;
};

export type TourStepData = {
  refKey: string;
  title: string;
  description: string;
};

export type SpiritAnimal = {
  id: string;
  name: string;
  icon: string;
  emotion: string;
  description: string;
  rarity: 'Común' | 'Poco Común' | 'Raro' | 'Épico' | 'Legendario';
  unlockHint: string;
};

export type Reward = {
  id: string;
  type: 'streak' | 'entry_count' | 'emotion_count' | 'share' | 'special';
  value: number;
  animal: SpiritAnimal;
};

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: 'Fácil' | 'Medio' | 'Difícil' | 'Experto';
}

export interface GameProps {
  emotionsList: Emotion[];
}
