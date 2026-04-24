import type { Prisma, PrismaClient } from '@proletariat-hub/database';

import type {
  CreateOneHubListItemInputData,
  HubListItemDbRecord,
  UpdateManyHubListItemsInputData,
  UpdateOneHubListItemInputData,
} from './types';

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

export async function updateOneHubListItem(params: {
  db: PrismaClient;
  where: { id: string };
  data: UpdateOneHubListItemInputData;
}): Promise<HubListItemDbRecord> {
  return params.db.hubListItem.update({
    where: params.where,
    data: params.data,
    include: {
      product: { include: { vendor: true, category: true } },
      claimedBy: true,
      purchasedBy: true,
      createdBy: true,
    },
  });
}

export async function updateManyHubListItems(params: {
  db: PrismaClient;
  where: { ids: string[] };
  data: UpdateManyHubListItemsInputData;
}): Promise<Prisma.BatchPayload> {
  return params.db.hubListItem.updateMany({
    where: { id: { in: params.where.ids } },
    data: params.data,
  });
}
