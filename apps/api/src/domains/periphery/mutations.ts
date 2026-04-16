import type { PrismaClient } from '@proletariat-hub/database';

import type {
  CreateOnePeripheryMutationData,
  PeripheryDbRecord,
  UpdateOnePeripheryData,
} from './types';

export async function createOnePeriphery(params: {
  db: PrismaClient;
  data: CreateOnePeripheryMutationData;
}): Promise<PeripheryDbRecord> {
  return params.db.hubPeriphery.create({
    data: {
      name: params.data.name,
      peripheryCategory: params.data.peripheryCategory,
      notes: params.data.notes,
      hub: { connect: { id: params.data.hubId } },
      createdBy: { connect: { id: params.data.createdById } },
      settings: {
        create: {
          birthDate: params.data.settings.birthDate,
          avatarIcon: params.data.settings.avatarIcon,
          avatarColor: params.data.settings.avatarColor,
          phoneNumber: params.data.settings.phoneNumber,
          email: params.data.settings.email,
        },
      },
    },
    include: { settings: true },
  });
}

export async function updateOnePeriphery(params: {
  db: PrismaClient;
  where: { id: string };
  data: UpdateOnePeripheryData;
}): Promise<PeripheryDbRecord> {
  return params.db.hubPeriphery.update({
    where: { id: params.where.id },
    data: {
      name: params.data.name,
      peripheryCategory: params.data.peripheryCategory,
      notes: params.data.notes,
      settings: params.data.settings,
    },
    include: { settings: true },
  });
}

export async function archiveOnePeriphery(params: {
  db: PrismaClient;
  where: { id: string };
}): Promise<void> {
  await params.db.hubPeriphery.update({
    where: { id: params.where.id },
    data: { archivedAt: new Date() },
  });
}
