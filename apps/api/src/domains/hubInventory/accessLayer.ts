import type { PrismaClient } from '@proletariat-hub/database';
import { TRPCError } from '@trpc/server';
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
import { createOneHubInventoryProduct, createOneHubInventoryVendor } from './mutations';
import {
  findManyHubInventoryProductCategories,
  findManyHubInventoryProducts,
  findManyHubInventoryVendors,
} from './queries';
import type {
  CreateOneHubInventoryProductInputData,
  CreateOneHubInventoryVendorInputData,
} from './types';

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

  async createOneVendor(params: {
    where: { hubId: string };
    data: CreateOneHubInventoryVendorInputData;
  }): Promise<HubInventoryVendor> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const existing = await this.db.hubInventoryVendor.findFirst({
        where: {
          hubId: params.where.hubId,
          name: { equals: params.data.name, mode: 'insensitive' },
        },
      });
      if (existing !== null) {
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
