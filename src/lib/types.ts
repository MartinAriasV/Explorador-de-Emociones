//
// 📍 ARCHIVO: src/lib/types.ts
//
export type Emotion = {
  id: string;
  userId: string;
  name: string;
  icon: string; // Emoji
  color: string;
  description: string;
  isCustom: boolean;
};

export type DiaryEntry = {
  id: string;
  userId: string;
  date: string; // ISO String
  emotionId: string;
  text: string;
};

// --- ¡NUEVOS TIPOS PARA LA TIENDA! ---
export type ItemPosition = {
  itemId: string;
  x: number;
  y: number;
};

export type ShopItemType = 'theme' | 'avatar_frame' | 'room_background' | 'room_furniture' | 'pet_toy' | 'pet_food';

export type ShopItem = {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: ShopItemType;
  value: string; // ej. 'theme-ocean', 'border-amber-400'
  iconUrl: string; // URL para el icono de la tienda
  imageUrl?: string; // URL para la imagen real (ej. fondo)
  icon?: string; // Fallback de emoji
};
// --- FIN DE NUEVOS TIPOS ---

export type SpiritAnimal = {
  id: string;
  name: string;
  icon: string; // <-- ¡AÑADIDO!
  emotion: string;
  description: string;
  rarity: 'Común' | 'Poco Común' | 'Raro' | 'Épico' | 'Legendario';
  unlockHint: string;
  lottieUrl: string; // (Lo mantenemos por si lo usamos en el futuro)
};

export type UserProfile = {
  id: string; // Coincide con el Auth UID
  name: string;
  email: string;
  avatar: string; // Emoji
  avatarType: 'emoji' | 'generated';
  
  // --- ¡CAMPOS DE GAMIFICACIÓN AÑADIDOS! ---
  unlockedAnimalIds: string[]; // Logros (ej. 'colibri-agil')
  points: number; // Moneda de la app
  currentStreak: number;
  lastEntryDate?: string; // ISO String
  entryCount?: number;
  purchasedItemIds: string[]; // Ítems de la tienda (ej. 'bg_jardin')
  
  // --- Campos de Personalización Activos ---
  activePetId: string | null; // ID de la mascota activa (ej. 'perro-leal')
  activeAvatarFrameId?: string | null;
  activeRoomBackgroundId?: string | null;
  activeAppThemeId?: string;
  
  // --- Posiciones de los Muebles ---
  itemPositions?: ItemPosition[];
};

// --- VISTAS AÑADIDAS ---
export type View = 
  | 'diary' 
  | 'emocionario' 
  | 'discover' 
  | 'games'
  | 'streak' 
  | 'sanctuary' // "Mi Habitación"
  | 'collection' // "Mi Colección" (el reemplazo del viejo Santuario)
  | 'pet-chat'   // "Compañero IA"
  | 'shop'       // "Tienda"
  | 'calm' 
  | 'report' 
  | 'share' 
  | 'profile';

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
  addPoints: (amount: number) => Promise<void>;
  user: User;
  onAscentGameEnd: (score: number) => Promise<void>;
}
