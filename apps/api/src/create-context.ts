import './types/fastifyAugmentation.js';

import { prisma } from '@proletariat-hub/database';
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

import type { Context } from './context';
import { getRedis } from './shared/lib/redis';

export async function createContext({ req, res }: CreateFastifyContextOptions): Promise<Context> {
  return {
    req,
    res,
    db: prisma,
    redis: getRedis(),
  };
}
