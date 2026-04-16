import type { PrismaClient } from '@proletariat-hub/database';

import type { HubListDbRecord } from './types';

export async function findUniqueHubListByHubId(params: {
  db: PrismaClient;
  where: { hubId: string };
}): Promise<HubListDbRecord> {
  return params.db.hubList.findFirstOrThrow({
    where: { hubId: params.where.hubId },
    include: {
      items: {
        where: { product: { archivedAt: null } },
        orderBy: { createdAt: 'asc' },
        include: {
          product: {
            include: {
              vendor: true,
              category: true,
            },
          },
          claimedBy: true,
          purchasedBy: true,
          createdBy: true,
        },
      },
    },
  });
}
