import type { AppRouter } from '@proletariat-hub/api/router';
import type { inferRouterOutputs } from '@trpc/server';
import { z } from 'zod';

import { trpc } from './trpcClient';

type FindManyPeripheryQueryOpts = Parameters<typeof trpc.periphery.findManyPeriphery.useQuery>[1];

export type FindManyPeripheryData = inferRouterOutputs<AppRouter>['periphery']['findManyPeriphery'];

const emptyFindManyPeripheryData: FindManyPeripheryData = [];

const findManyPeripheryResponseGuard = z.array(z.object({ id: z.string() }));

function isFindManyPeripheryData(value: unknown): value is FindManyPeripheryData {
  return findManyPeripheryResponseGuard.safeParse(value).success;
}

interface UseFindManyPeripheryResult extends Omit<
  ReturnType<typeof trpc.periphery.findManyPeriphery.useQuery>,
  'data'
> {
  data: FindManyPeripheryData;
}

export function useFindManyPeriphery(
  opts?: FindManyPeripheryQueryOpts,
): UseFindManyPeripheryResult {
  const query = trpc.periphery.findManyPeriphery.useQuery(undefined, opts ?? {});
  const data: FindManyPeripheryData = isFindManyPeripheryData(query.data)
    ? query.data
    : emptyFindManyPeripheryData;
  return { ...query, data };
}

type FindUniqueHubListQueryOpts = Parameters<typeof trpc.hubList.findUniqueHubList.useQuery>[1];

export type FindUniqueHubListData = inferRouterOutputs<AppRouter>['hubList']['findUniqueHubList'];

const emptyFindUniqueHubListData: FindUniqueHubListData = {
  id: '',
  name: '',
  createdAt: new Date(),
  items: [],
};

const findUniqueHubListResponseGuard = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  items: z.array(z.object({ id: z.string() })),
});

function isFindUniqueHubListData(value: unknown): value is FindUniqueHubListData {
  return findUniqueHubListResponseGuard.safeParse(value).success;
}

interface UseFindUniqueHubListResult extends Omit<
  ReturnType<typeof trpc.hubList.findUniqueHubList.useQuery>,
  'data'
> {
  data: FindUniqueHubListData;
}

export function useFindUniqueHubList(
  opts?: FindUniqueHubListQueryOpts,
): UseFindUniqueHubListResult {
  const query = trpc.hubList.findUniqueHubList.useQuery(undefined, opts ?? {});
  const data: FindUniqueHubListData = isFindUniqueHubListData(query.data)
    ? query.data
    : emptyFindUniqueHubListData;
  return { ...query, data };
}

type FindManyHubInventoryCategoriesQueryOpts = Parameters<
  typeof trpc.hubInventory.findManyCategories.useQuery
>[1];

export type FindManyHubInventoryCategoriesData =
  inferRouterOutputs<AppRouter>['hubInventory']['findManyCategories'];

const emptyFindManyHubInventoryCategoriesData: FindManyHubInventoryCategoriesData = [];

const findManyHubInventoryCategoriesResponseGuard = z.array(z.object({ id: z.string() }));

function isFindManyHubInventoryCategoriesData(
  value: unknown,
): value is FindManyHubInventoryCategoriesData {
  return findManyHubInventoryCategoriesResponseGuard.safeParse(value).success;
}

interface UseFindManyCategoriesResult extends Omit<
  ReturnType<typeof trpc.hubInventory.findManyCategories.useQuery>,
  'data'
> {
  data: FindManyHubInventoryCategoriesData;
}

export function useFindManyCategories(
  opts?: FindManyHubInventoryCategoriesQueryOpts,
): UseFindManyCategoriesResult {
  const query = trpc.hubInventory.findManyCategories.useQuery(undefined, opts ?? {});
  const data: FindManyHubInventoryCategoriesData = isFindManyHubInventoryCategoriesData(query.data)
    ? query.data
    : emptyFindManyHubInventoryCategoriesData;
  return { ...query, data };
}

type FindManyHubInventoryVendorsQueryOpts = Parameters<
  typeof trpc.hubInventory.findManyVendors.useQuery
>[1];

export type FindManyHubInventoryVendorsData =
  inferRouterOutputs<AppRouter>['hubInventory']['findManyVendors'];

const emptyFindManyHubInventoryVendorsData: FindManyHubInventoryVendorsData = [];

const findManyHubInventoryVendorsResponseGuard = z.array(z.object({ id: z.string() }));

function isFindManyHubInventoryVendorsData(
  value: unknown,
): value is FindManyHubInventoryVendorsData {
  return findManyHubInventoryVendorsResponseGuard.safeParse(value).success;
}

interface UseFindManyVendorsResult extends Omit<
  ReturnType<typeof trpc.hubInventory.findManyVendors.useQuery>,
  'data'
> {
  data: FindManyHubInventoryVendorsData;
}

export function useFindManyVendors(
  opts?: FindManyHubInventoryVendorsQueryOpts,
): UseFindManyVendorsResult {
  const query = trpc.hubInventory.findManyVendors.useQuery(undefined, opts ?? {});
  const data: FindManyHubInventoryVendorsData = isFindManyHubInventoryVendorsData(query.data)
    ? query.data
    : emptyFindManyHubInventoryVendorsData;
  return { ...query, data };
}
