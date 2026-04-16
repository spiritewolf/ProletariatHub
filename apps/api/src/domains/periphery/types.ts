import type {
  HubPeripheryDbRecord as HubPeripheryDbRecordBase,
  HubPeripherySettingsConfigDbRecord,
} from '@proletariat-hub/database';

export type { HubPeripherySettingsConfigDbRecord } from '@proletariat-hub/database';

export interface PeripheryDbRecord extends HubPeripheryDbRecordBase {
  settings: HubPeripherySettingsConfigDbRecord;
}

export type FindPeripheryWhereUniqueInput = {
  id: string;
};

export type CreateOnePeripheryMutationData = {
  name: string;
  peripheryCategory: string;
  notes?: string | null;
  hubId: string;
  createdById: string;
  settings: {
    birthDate?: Date | null;
    avatarIcon?: string | null;
    avatarColor?: string | null;
    phoneNumber?: string | null;
    email?: string | null;
  };
};

export type UpdateOnePeripheryData = {
  name?: string;
  peripheryCategory?: string;
  notes?: string | null;
  settings?: {
    update: {
      birthDate?: Date | null;
      avatarIcon?: string | null;
      avatarColor?: string | null;
      phoneNumber?: string | null;
      email?: string | null;
    };
  };
};
