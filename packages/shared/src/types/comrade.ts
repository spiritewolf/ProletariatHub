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
} as const;
export type ComradeAvatarIconType =
  (typeof ComradeAvatarIconType)[keyof typeof ComradeAvatarIconType];

export type Comrade = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  role: ComradeRole;
  onboardStatus: ComradeOnboardStatus;
  phoneNumber?: string;
  email?: string;
  signalUsername?: string;
  telegramUsername?: string;
};

export type Session = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  comradeId: string;
};
