import type { Prisma } from '@proletariat-hub/database';

export const COMRADE_DEFAULT_INCLUDE = {
  role: true,
  settings: true,
} as const;

export type ComradeDbRecord = Prisma.ComradeGetPayload<{
  include: typeof COMRADE_DEFAULT_INCLUDE;
}>;

export type FindComradeWhereUniqueInput = {
  id: string;
};

export type FindComradeWhereUsernameInput = {
  username: string;
};
