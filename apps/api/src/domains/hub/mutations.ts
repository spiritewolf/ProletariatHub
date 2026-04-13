import type { PrismaClient } from '@proletariat-hub/database';

import type { FindHubWhereUniqueInput, HubDbRecord, UpdateOneHubInput } from './types';
import { HUB_DEFAULT_INCLUDE } from './types';

export async function updateOneHub(params: {
  db: PrismaClient;
  where: FindHubWhereUniqueInput;
  data: UpdateOneHubInput;
}): Promise<HubDbRecord> {
  const { db, where, data } = params;
  return await db.hub.update({
    where: { id: where.id },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
    },
    include: HUB_DEFAULT_INCLUDE,
  });
}
