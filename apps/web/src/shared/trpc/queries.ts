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

type UseFindManyPeripheryResult = Omit<
  ReturnType<typeof trpc.periphery.findManyPeriphery.useQuery>,
  'data'
> & { data: FindManyPeripheryData };

export function useFindManyPeriphery(
  opts?: FindManyPeripheryQueryOpts,
): UseFindManyPeripheryResult {
  const query = trpc.periphery.findManyPeriphery.useQuery(undefined, opts ?? {});
  const data: FindManyPeripheryData = isFindManyPeripheryData(query.data)
    ? query.data
    : emptyFindManyPeripheryData;
  return { ...query, data };
}
