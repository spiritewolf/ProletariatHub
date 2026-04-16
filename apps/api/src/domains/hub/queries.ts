import type { PrismaClient } from '@proletariat-hub/database';

import type { FindHubWhereUniqueInput, HubDbRecord } from './types';

export async function findUniqueHub(params: {
  db: PrismaClient;
  where: FindHubWhereUniqueInput;
}): Promise<HubDbRecord> {
  return params.db.hub.findFirstOrThrow({
    where: {
      id: params.where.id,
      archivedAt: null,
    },
    include: { settings: true },
  });
}
