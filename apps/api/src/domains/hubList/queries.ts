import type { PrismaClient } from '@proletariat-hub/database';

import type { HubListDbRecord, HubListItemDbRecord, HubListItemsOrderByInput } from './types';

export async function findFirstHubList(params: {
  db: PrismaClient;
  where: { hubId: string };
  orderBy?: HubListItemsOrderByInput;
}): Promise<HubListDbRecord> {
  return params.db.hubList.findFirstOrThrow({
    where: { hubId: params.where.hubId },
    include: {
      items: {
        where: { product: { archivedAt: null } },
        orderBy: params?.orderBy?.priority
          ? [{ priority: params.orderBy.priority }, { createdAt: 'asc' }]
          : { createdAt: 'asc' },
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

export async function findUniqueHubListItem(params: {
  db: PrismaClient;
  where: { hubListId: string; hubListItemId: string };
}): Promise<HubListItemDbRecord> {
  return params.db.hubListItem.findUniqueOrThrow({
    where: { id: params.where.hubListItemId, listId: params.where.hubListId },
    include: {
      product: { include: { vendor: true, category: true } },
      claimedBy: true,
      purchasedBy: true,
      createdBy: true,
    },
  });
}
