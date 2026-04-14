import type { Prisma } from '@proletariat-hub/database';

export const COMRADE_DEFAULT_INCLUDE = {
  role: true,
  settings: true,
} as const;

export type ComradeDbRecord = Prisma.ComradeGetPayload<{
  include: typeof COMRADE_DEFAULT_INCLUDE;
}>;

export type FindComradeWhereUniqueInput = {
  id?: string;
  username?: string;
};

export type FindComradeWhereInput = {
  ids?: string[];
  hubId?: string;
};

export type UpdateOneComradeInput = {
  username?: string;
  password?: string;
  onboardStatus?: string;
  settings?: {
    email?: string | null;
    phoneNumber?: string | null;
    signalUsername?: string | null;
    telegramUsername?: string | null;
    birthDate?: Date | null;
  };
};

export type CreateOneComradeInput = {
  username: string;
  avatarIcon: string;
  hubId: string;
  roleId: string;
};
