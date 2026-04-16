import type { PrismaClient } from '@proletariat-hub/database';

import type { CreateOneHubListItemInputData, HubListItemDbRecord } from './types';

export async function createOneHubListItem(params: {
  db: PrismaClient;
  data: CreateOneHubListItemInputData;
}): Promise<HubListItemDbRecord> {
  return params.db.hubListItem.create({
    data: {
      listId: params.data.listId,
      productId: params.data.productId,
      createdById: params.data.createdById,
      status: params.data.status,
      priority: params.data.priority,
      quantity: params.data.quantity,
      notes: params.data.notes,
    },
    include: {
      product: { include: { vendor: true, category: true } },
      claimedBy: true,
      purchasedBy: true,
      createdBy: true,
    },
  });
}

export async function deleteOneHubListItem(params: {
  db: PrismaClient;
  where: { id: string };
}): Promise<void> {
  await params.db.hubListItem.delete({
    where: params.where,
  });
}
