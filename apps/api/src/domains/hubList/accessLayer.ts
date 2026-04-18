import type { PrismaClient } from '@proletariat-hub/database';
import type { HubList, HubListItem } from '@proletariat-hub/types';
import { HubListItemStatus } from '@proletariat-hub/types';

import type { DomainErrorHandler } from '../../shared/util/prismaErrorHandler';
import { parseHubList, parseHubListItem } from './mapper';
import { createOneHubListItem, deleteOneHubListItem } from './mutations';
import { findFirstHubList, findUniqueHubListItem } from './queries';
import type { CreateOneHubListItemAccessInputData, HubListItemsOrderByInput } from './types';

export class HubListAccessLayer {
  constructor(
    private readonly db: PrismaClient,
    private readonly domainError: DomainErrorHandler,
  ) {}

  async findFirst(params: {
    where: { hubId: string };
    orderBy?: HubListItemsOrderByInput;
  }): Promise<HubList> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const hubListDbRecord = await findFirstHubList({
        db: this.db,
        where: params.where,
        orderBy: params.orderBy,
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
}
