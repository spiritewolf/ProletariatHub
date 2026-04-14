import type { Prisma } from '@proletariat-hub/database';

export type ComradeSettingsConfigDbRecord = Prisma.ComradeSettingsConfigGetPayload<
  Record<string, never>
>;

export type FindComradeSettingsConfigWhereUniqueInput = {
  id: string;
};

export type UpdateComradeSettingsConfigData = {
  birthDate?: Date | null;
  email?: string | null;
  phoneNumber?: string | null;
  signalUsername?: string | null;
  telegramUsername?: string | null;
};
