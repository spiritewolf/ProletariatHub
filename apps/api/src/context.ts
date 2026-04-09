import { getRedis } from '@proletariat-hub/api/shared/lib/redis';
import { prisma } from '@proletariat-hub/db';
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

export async function createContext({ req, res }: CreateFastifyContextOptions) {
  return { req, res, db: prisma, redis: getRedis() };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
