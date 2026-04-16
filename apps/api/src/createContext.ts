import './types/fastifyAugmentation.js';

import { prisma } from '@proletariat-hub/database';
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

import { ComradeAccessLayer } from './domains/comrade';
import { ComradeSettingsAccessLayer } from './domains/comradeSettings';
import { HubAccessLayer } from './domains/hub';
import { HubInventoryAccessLayer } from './domains/hubInventory';
import { HubListAccessLayer } from './domains/hubList';
import { PeripheryAccessLayer } from './domains/periphery';
import { RoleAccessLayer } from './domains/role';
import { getRedis } from './shared/redis';
import { createDomainErrorHandler } from './shared/util/prismaErrorHandler';
import type { PublicContext } from './types/context';

export async function createContext({
  req,
  res,
}: CreateFastifyContextOptions): Promise<PublicContext> {
  const comradeErrorHandler = createDomainErrorHandler('comrade');
  const comradeSettingsErrorHandler = createDomainErrorHandler('comradeSettings');
  const hubErrorHandler = createDomainErrorHandler('hub');
  const hubListErrorHandler = createDomainErrorHandler('hubList');
  const hubInventoryErrorHandler = createDomainErrorHandler('hubInventory');
  const peripheryErrorHandler = createDomainErrorHandler('periphery');
  const roleErrorHandler = createDomainErrorHandler('role');

  const roleAccessLayer = new RoleAccessLayer(prisma, roleErrorHandler);
  const hubAccessLayer = new HubAccessLayer(prisma, hubErrorHandler);
  const hubListAccessLayer = new HubListAccessLayer(prisma, hubListErrorHandler);
  const hubInventoryAccessLayer = new HubInventoryAccessLayer(prisma, hubInventoryErrorHandler);
  const peripheryAccessLayer = new PeripheryAccessLayer(prisma, peripheryErrorHandler);
  const comradeAccessLayer = new ComradeAccessLayer(prisma, comradeErrorHandler, {
    hubAccessLayer,
    roleAccessLayer,
  });
  const comradeSettingsAccessLayer = new ComradeSettingsAccessLayer(
    prisma,
    comradeSettingsErrorHandler,
    {
      comradeAccessLayer,
    },
  );

  return {
    req,
    res,
    db: prisma,
    redis: getRedis(),
    comradeAccessLayer,
    comradeSettingsAccessLayer,
    peripheryAccessLayer,
    hubListAccessLayer,
    hubInventoryAccessLayer,
    hubAccessLayer,
    roleAccessLayer,
  };
}
