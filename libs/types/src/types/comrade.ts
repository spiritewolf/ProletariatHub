export const ComradeRole = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
} as const;
export type ComradeRole = (typeof ComradeRole)[keyof typeof ComradeRole];

export const ComradeOnboardStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETE: 'COMPLETE',
} as const;
export type ComradeOnboardStatus = (typeof ComradeOnboardStatus)[keyof typeof ComradeOnboardStatus];

export const ComradeAvatarIconType = {
  USER: 'USER',
  MENU: 'MENU',
  HAND_FIST: 'HAND_FIST',
  CROWN: 'CROWN',
  ATOM: 'ATOM',
  EGG_FRIED: 'EGG_FRIED',
  PALETTE: 'PALETTE',
  SNAIL: 'SNAIL',
  CAT: 'CAT',
  DOG: 'DOG',
  FISH: 'FISH',
} as const;
export type ComradeAvatarIconType =
  (typeof ComradeAvatarIconType)[keyof typeof ComradeAvatarIconType];

export type ComradeSettingsConfig = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  birthDate: Date | null;
  avatarIcon: ComradeAvatarIconType | null;
  avatarColor: string | null;
  phoneNumber: string | null;
  email: string | null;
  signalUsername: string | null;
  telegramUsername: string | null;
};

export type Comrade = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  role: ComradeRole;
  onboardStatus: ComradeOnboardStatus;
  hubId: string;
  settings: ComradeSettingsConfig;
};
