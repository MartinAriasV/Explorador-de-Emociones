
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
  unlockedAnimalIds: string[];
  points: number;
  purchasedItemIds: string[];
  equippedItems: { [key in ShopItemType]?: string }; // e.g. { 'theme': 'theme-ocean', 'avatar_frame': 'frame-gold' }
  ascentHighScore?: number;
  activePetId: string | null;
  petAccessoryPositions?: { [itemId: string]: { x: number; y: number } };
  petPosition?: { x: number; y: number };
  activePetBackgroundId?: string | null;
};

export type View = 'diary' | 'emocionario' | 'discover' | 'calm' | 'report' | 'share' | 'profile' | 'streak' | 'sanctuary' | 'games' | 'pet-chat' | 'shop';

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
  name:string;
  imageUrl: string;
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
  userProfile: UserProfile;
}

export type ShopItemType = 'theme' | 'avatar_frame' | 'pet_accessory' | 'pet_background';

export type ShopItem = {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: ShopItemType;
  value: string; // e.g. 'theme-ocean', 'border-amber-400', 'bed'
  icon: string; // Emoji or identifier for the item
  imageUrl?: string;
};

export type PetAccessory = {
    id: string;
    name: string;
    icon: string;
    category: 'head' | 'neck' | 'body';
};

    
