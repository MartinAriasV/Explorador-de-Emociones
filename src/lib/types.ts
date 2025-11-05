export type Emotion = {
  id: string;
  userProfileId: string;
  name: string;
  icon: string;
  color: string;
  description: string;
};

export type DiaryEntry = {
  id: string;
  userProfileId: string;
  date: string;
  emotionId: string;
  text: string;
};

export type UserProfile = {
  id?: string; // Firestore ID
  name: string;
  avatar: string; // Can be an emoji or a URL for generated avatar
  avatarType: 'emoji' | 'generated';
  unlockedAnimalIds?: string[];
  emotionCount?: number;
};

export type View = 'diary' | 'emocionario' | 'discover' | 'calm' | 'report' | 'share' | 'profile' | 'streak' | 'sanctuary';

export type PredefinedEmotion = {
  name: string;
  icon: string;
  description: string;
  example: string;
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
  type: 'streak' | 'entry_count' | 'emotion_count';
  value: number;
  animal: SpiritAnimal;
};

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: 'Fácil' | 'Medio' | 'Difícil' | 'Experto';
}
