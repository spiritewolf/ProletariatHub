import type { PrismaClient } from '@proletariat-hub/database';

import type { FindPeripheryWhereUniqueInput, PeripheryDbRecord } from './types';

export async function findUniquePeriphery(params: {
  db: PrismaClient;
  where: FindPeripheryWhereUniqueInput;
}): Promise<PeripheryDbRecord> {
  const hubPeripheryDbRecord = await params.db.hubPeriphery.findUniqueOrThrow({
    where: { id: params.where.id },
    include: { settings: true },
  });
  return hubPeripheryDbRecord;
}

export async function findManyPeriphery(params: {
  db: PrismaClient;
  where: { hubId: string };
}): Promise<PeripheryDbRecord[]> {
  return params.db.hubPeriphery.findMany({
    where: {
      hubId: params.where.hubId,
      archivedAt: null,
    },
    include: { settings: true },
    orderBy: { createdAt: 'asc' },
  });
}
