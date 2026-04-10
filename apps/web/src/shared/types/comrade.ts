export const ComradeRole = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
} as const;
export type ComradeRole = (typeof ComradeRole)[keyof typeof ComradeRole];

export const OnboardStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETE: 'COMPLETE',
} as const;
export type OnboardStatus = (typeof OnboardStatus)[keyof typeof OnboardStatus];

export type Comrade = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  password: string;
  role: ComradeRole;
  onboardStatus: OnboardStatus;
  phoneNumber?: string;
  email?: string;
  signalUsername?: string;
  telegramUsername?: string;
};
