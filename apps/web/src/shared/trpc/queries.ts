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
