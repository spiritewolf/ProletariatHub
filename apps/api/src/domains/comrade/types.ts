import type {
  ComradeDbRecord as ComradeDbRecordBase,
  ComradeSettingsConfigDbRecord,
  RoleDbRecord,
} from '@proletariat-hub/database';

export interface ComradeDbRecord extends ComradeDbRecordBase {
  role: RoleDbRecord;
  settings: ComradeSettingsConfigDbRecord;
}

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
