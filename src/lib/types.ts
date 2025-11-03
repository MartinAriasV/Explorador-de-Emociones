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
  name: string;
  avatar: string; // Can be an emoji or a URL for generated avatar
  avatarType: 'emoji' | 'generated';
};

export type View = 'diary' | 'emocionario' | 'discover' | 'calm' | 'report' | 'share' | 'profile';

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
