import type { PrismaClient } from '@proletariat-hub/database';
import type {
  HubInventoryProduct,
  HubInventoryProductCategory,
  HubInventoryVendor,
} from '@proletariat-hub/types';

import type { DomainErrorHandler } from '../../shared/util/prismaErrorHandler';
import {
  parseHubInventoryProduct,
  parseHubInventoryProductCategory,
  parseHubInventoryVendor,
} from './mapper';
import {
  findManyHubInventoryProductCategories,
  findManyHubInventoryProducts,
  findManyHubInventoryVendors,
} from './queries';

export class HubInventoryAccessLayer {
  constructor(
    private readonly db: PrismaClient,
    private readonly domainError: DomainErrorHandler,
  ) {}

  async findManyProducts(params: {
    where: { hubId: string; searchText?: string | null };
  }): Promise<HubInventoryProduct[]> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const hubInventoryProductDbRecords = await findManyHubInventoryProducts({
        db: this.db,
        where: params.where,
      });
      return hubInventoryProductDbRecords.map(parseHubInventoryProduct);
    });
  }

  async findManyCategories(params: {
    where: { hubId: string };
  }): Promise<HubInventoryProductCategory[]> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const hubInventoryProductCategoryDbRecords = await findManyHubInventoryProductCategories({
        db: this.db,
        where: params.where,
      });
      return hubInventoryProductCategoryDbRecords.map(parseHubInventoryProductCategory);
    });
  }

  async findManyVendors(params: { where: { hubId: string } }): Promise<HubInventoryVendor[]> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const hubInventoryVendorDbRecords = await findManyHubInventoryVendors({
        db: this.db,
        where: params.where,
      });
      return hubInventoryVendorDbRecords.map(parseHubInventoryVendor);
    });
  }
}
