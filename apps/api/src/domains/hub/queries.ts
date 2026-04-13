import type { PrismaClient } from '@proletariat-hub/database';

import type { FindHubWhereUniqueInput, HubDbRecord } from './types';
import { HUB_DEFAULT_INCLUDE } from './types';

export async function findUniqueHub(params: {
  db: PrismaClient;
  where: FindHubWhereUniqueInput;
}): Promise<HubDbRecord> {
  return params.db.hub.findFirstOrThrow({
    where: {
      id: params.where.id,
      archivedAt: null,
    },
    include: HUB_DEFAULT_INCLUDE,
  });
}
