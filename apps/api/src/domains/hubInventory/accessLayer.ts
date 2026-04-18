import type { PrismaClient } from '@proletariat-hub/database';
import type {
  HubInventoryProduct,
  HubInventoryProductCategory,
  HubInventoryVendor,
} from '@proletariat-hub/types';
import { TRPCError } from '@trpc/server';

import type { DomainErrorHandler } from '../../shared/util/prismaErrorHandler';
import {
  parseHubInventoryProduct,
  parseHubInventoryProductCategory,
  parseHubInventoryVendor,
} from './mapper';
import { createOneHubInventoryProduct, createOneHubInventoryVendor } from './mutations';
import {
  findFirstHubInventoryVendorNullable,
  findManyHubInventoryProductCategories,
  findManyHubInventoryProducts,
  findManyHubInventoryVendors,
} from './queries';
import type {
  CreateOneHubInventoryProductInputData,
  CreateOneHubInventoryVendorInputData,
  FindHubInventoryVendorNullableWhereFirstInput,
} from './types';

export class HubInventoryAccessLayer {
  constructor(
    private readonly db: PrismaClient,
    private readonly domainError: DomainErrorHandler,
  ) {}

  // PRODUCTS

  async findManyProducts(params: {
    where: { hubId: string; searchText?: string };
  }): Promise<HubInventoryProduct[]> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const hubInventoryProductDbRecords = await findManyHubInventoryProducts({
        db: this.db,
        where: params.where,
      });
      return hubInventoryProductDbRecords.map(parseHubInventoryProduct);
    });
  }

  async createOneProduct(params: {
    where: { hubId: string };
    data: CreateOneHubInventoryProductInputData;
  }): Promise<HubInventoryProduct> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const hubInventoryProductDbRecord = await createOneHubInventoryProduct({
        db: this.db,
        where: params.where,
        data: params.data,
      });
      return parseHubInventoryProduct(hubInventoryProductDbRecord);
    });
  }

  // CATEGORIES

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

  // VENDORS

  async findFirstVendorNullable(params: {
    where: FindHubInventoryVendorNullableWhereFirstInput;
  }): Promise<HubInventoryVendor | null> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const hubInventoryVendorDbRecord = await findFirstHubInventoryVendorNullable({
        db: this.db,
        where: params.where,
      });
      return hubInventoryVendorDbRecord
        ? parseHubInventoryVendor(hubInventoryVendorDbRecord)
        : null;
    });
  }

  async findManyVendors(params: {
    where: { hubId: string; searchText?: string };
  }): Promise<HubInventoryVendor[]> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const hubInventoryVendorDbRecords = await findManyHubInventoryVendors({
        db: this.db,
        where: params.where,
      });
      return hubInventoryVendorDbRecords.map(parseHubInventoryVendor);
    });
  }

  async createOneVendor(params: {
    where: { hubId: string };
    data: CreateOneHubInventoryVendorInputData;
  }): Promise<HubInventoryVendor> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const existingVendor = await this.findFirstVendorNullable({
        where: {
          hubId: params.where.hubId,
          searchText: params.data.name,
        },
      });

      if (existingVendor) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'A vendor with this name already exists',
        });
      }

      const hubInventoryVendorDbRecord = await createOneHubInventoryVendor({
        db: this.db,
        where: params.where,
        data: params.data,
      });
      return parseHubInventoryVendor(hubInventoryVendorDbRecord);
    });
  }
}
