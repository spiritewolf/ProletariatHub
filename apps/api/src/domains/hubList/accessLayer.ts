import type { Prisma, PrismaClient } from '@proletariat-hub/database';
import type { HubList, HubListItem } from '@proletariat-hub/types';
import { HubListItemStatus } from '@proletariat-hub/types';

import type { DomainErrorHandler } from '../../shared/util/prismaErrorHandler';
import { parseHubList, parseHubListItem } from './mapper';
import {
  createOneHubListItem,
  deleteOneHubListItem,
  updateManyHubListItems,
  updateOneHubListItem,
} from './mutations';
import { findFirstHubList, findUniqueHubListItem } from './queries';
import type {
  CreateOneHubListItemAccessInputData,
  UpdateManyHubListItemsInputData,
  UpdateOneHubListItemInputData,
} from './types';

export class HubListAccessLayer {
  constructor(
    private readonly db: PrismaClient,
    private readonly domainError: DomainErrorHandler,
  ) {}

  async findFirst(params: { where: { hubId: string } }): Promise<HubList> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const hubListDbRecord = await findFirstHubList({
        db: this.db,
        where: params.where,
      });
      return parseHubList(hubListDbRecord);
    });
  }

  async findUniqueHubListItem(params: {
    where: { hubListId: string; hubListItemId: string };
  }): Promise<HubListItem> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const hubListItemDbRecord = await findUniqueHubListItem({
        db: this.db,
        where: params.where,
      });
      return parseHubListItem(hubListItemDbRecord);
    });
  }

  async createOneListItem(params: {
    where: { hubId: string };
    data: CreateOneHubListItemAccessInputData;
  }): Promise<HubListItem> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const hubListDbRecord = await this.findFirst({
        where: params.where,
      });

      const hubListItemDbRecord = await createOneHubListItem({
        db: this.db,
        data: {
          listId: hubListDbRecord.id,
          productId: params.data.productId,
          createdById: params.data.createdById,
          status: HubListItemStatus.ACTIVE,
          priority: params.data.priority,
          quantity: params.data.quantity,
          notes: params.data.notes,
        },
      });

      return parseHubListItem(hubListItemDbRecord);
    });
  }

  async removeOneListItem(params: {
    where: { hubListId: string; hubListItemId: string };
  }): Promise<void> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const hubListItemDbRecord = await this.findUniqueHubListItem(params);

      await deleteOneHubListItem({
        db: this.db,
        where: { id: hubListItemDbRecord.id },
      });
    });
  }

  async updateOne(params: {
    where: { listItemId: string };
    data: UpdateOneHubListItemInputData;
  }): Promise<HubListItem> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const hubListItemDbRecord = await updateOneHubListItem({
        db: this.db,
        where: { id: params.where.listItemId },
        data: params.data,
      });

      return parseHubListItem(hubListItemDbRecord);
    });
  }

  async updateMany(params: {
    where: { listItemIds: string[] };
    data: UpdateManyHubListItemsInputData;
  }): Promise<Prisma.BatchPayload> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      return updateManyHubListItems({
        db: this.db,
        where: { ids: params.where.listItemIds },
        data: params.data,
      });
    });
  }

  async claimOneListItem(params: {
    where: { listItemId: string };
    data: { claimedById: string };
  }): Promise<HubListItem> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      return await this.updateOne({
        where: params.where,
        data: {
          claimedById: params.data.claimedById,
          claimedAt: new Date(),
          status: HubListItemStatus.CLAIMED,
        },
      });
    });
  }

  async claimManyListItems(params: {
    where: { listItemIds: string[] };
    data: { claimedById: string };
  }): Promise<Prisma.BatchPayload> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      return await this.updateMany({
        where: params.where,
        data: {
          claimedById: params.data.claimedById,
          claimedAt: new Date(),
          status: HubListItemStatus.CLAIMED,
        },
      });
    });
  }

  async unclaimOneListItem(params: { where: { listItemId: string } }): Promise<HubListItem> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      return await this.updateOne({
        where: params.where,
        data: {
          claimedById: null,
          claimedAt: null,
          status: HubListItemStatus.ACTIVE,
        },
      });
    });
  }

  async unclaimManyListItems(params: {
    where: { listItemIds: string[] };
  }): Promise<Prisma.BatchPayload> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      return await this.updateMany({
        where: params.where,
        data: {
          claimedById: null,
          claimedAt: null,
          status: HubListItemStatus.ACTIVE,
        },
      });
    });
  }
}
