import type { Prisma } from '@proletariat-hub/database';

export const PERIPHERY_DEFAULT_INCLUDE = {
  settings: true,
} as const;

export type PeripheryDbRecord = Prisma.HubPeripheryGetPayload<{
  include: typeof PERIPHERY_DEFAULT_INCLUDE;
}>;

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
