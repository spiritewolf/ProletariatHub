import './types/fastifyAugmentation.js';

import { prisma } from '@proletariat-hub/database';
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

import { ComradeAccessLayer } from './domains/comrade';
import { HubAccessLayer } from './domains/hub';
import { RoleAccessLayer } from './domains/role';
import { getRedis } from './shared/redis';
import type { Context } from './types/context';

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
