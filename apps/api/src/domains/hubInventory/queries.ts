import { Prisma, type PrismaClient } from '@proletariat-hub/database';

import type {
  FindHubInventoryVendorNullableWhereFirstInput,
  HubInventoryProductCategoryDbRecord,
  HubInventoryProductWithCategoryVendorDbRecord,
  HubInventoryVendorDbRecord,
} from './types';

const HUB_INVENTORY_AUTOCOMPLETE_RESULT_LIMIT = 10;

/** Duplicate-name lookup for vendor creation: no unique key on name alone, so `findFirst` is intentional. */
export async function findFirstHubInventoryVendorNullable(params: {
  db: PrismaClient;
  where: FindHubInventoryVendorNullableWhereFirstInput;
}): Promise<HubInventoryVendorDbRecord | null> {
  return params.db.hubInventoryVendor.findFirst({
    where: {
      hubId: params.where.hubId,
      name: params.where.searchText
        ? { equals: params.where.searchText, mode: 'insensitive' }
        : undefined,
    },
  });
}

export async function findManyHubInventoryProducts(params: {
  db: PrismaClient;
  where: { hubId: string; searchText?: string };
}): Promise<HubInventoryProductWithCategoryVendorDbRecord[]> {
  const { hubId, searchText } = params.where;

  return params.db.hubInventoryProduct.findMany({
    where: {
      hubId,
      archivedAt: null,
      name: searchText ? { contains: searchText, mode: Prisma.QueryMode.insensitive } : undefined,
    },
    orderBy: { createdAt: 'desc' },
    take: HUB_INVENTORY_AUTOCOMPLETE_RESULT_LIMIT,
    include: {
      category: true,
      vendor: true,
    },
  });
}

export async function findManyHubInventoryProductCategories(params: {
  db: PrismaClient;
  where: { hubId: string };
}): Promise<HubInventoryProductCategoryDbRecord[]> {
  return params.db.hubInventoryProductCategory.findMany({
    where: { hubId: params.where.hubId },
    orderBy: { name: 'asc' },
  });
}

export async function findManyHubInventoryVendors(params: {
  db: PrismaClient;
  where: { hubId: string; searchText?: string };
}): Promise<HubInventoryVendorDbRecord[]> {
  const { hubId, searchText } = params.where;

  return params.db.hubInventoryVendor.findMany({
    where: {
      hubId,
      name: searchText ? { contains: searchText, mode: Prisma.QueryMode.insensitive } : undefined,
    },
    orderBy: { createdAt: 'desc' },
    take: HUB_INVENTORY_AUTOCOMPLETE_RESULT_LIMIT,
  });
}
