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

export type Comrade = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  password: string;
  role: ComradeRole;
  onboardStatus: ComradeOnboardStatus;
  phoneNumber?: string;
  email?: string;
  signalUsername?: string;
  telegramUsername?: string;
};

export const ComradeIconType = {
  USER: 'USER',
  MENU: 'MENU',
  HAND_FIST: 'HAND_FIST',
  CROWN: 'CROWN',
  ATOM: 'ATOM',
  EGG_FRIED: 'EGG_FRIED',
  PALETTE: 'PALETTE',
  SNAIL: 'SNAIL',
} as const;
export type ComradeIconType = (typeof ComradeIconType)[keyof typeof ComradeIconType];
