import './types/fastifyAugmentation.js';

import { prisma } from '@proletariat-hub/database';
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

import type { Context } from './context';
import { ComradeAccessLayer } from './domains/comrade/accessLayer';
import { HubAccessLayer } from './domains/hub/accessLayer';
import { RoleAccessLayer } from './domains/role/accessLayer';
import { getRedis } from './shared/lib/redis';

export async function createContext({ req, res }: CreateFastifyContextOptions): Promise<Context> {
  const roleAccessLayer = new RoleAccessLayer(prisma);
  const hubAccessLayer = new HubAccessLayer(prisma);
  const comradeAccessLayer = new ComradeAccessLayer(prisma, { hubAccessLayer, roleAccessLayer });

  return {
    req,
    res,
    db: prisma,
    redis: getRedis(),
    comradeAccessLayer,
    hubAccessLayer,
    roleAccessLayer,
  };
}
