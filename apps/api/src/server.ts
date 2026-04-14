import { validateEnv } from '@proletariat-hub/config';
import { prisma } from '@proletariat-hub/database';
import fastify from 'fastify';

import { createContext } from './createContext';
import { registerCors } from './plugins/cors';
import { registerSession } from './plugins/session';
import { registerTrpc } from './plugins/trpc';
import { registerHealth } from './routes/health';
import { getRedis, initRedis } from './shared/redis';
import { registerShutdown } from './shared/shutdown';

async function start(): Promise<void> {
  const env = validateEnv();
  initRedis(env.REDIS_URL);

  const server = fastify({
    logger: true,
    routerOptions: {
      maxParamLength: 5000,
    },
  });

  const redis = getRedis();

  await registerCors(server, env);
  await registerSession(server, redis, env);
  await registerTrpc(server, { createContext });
  await registerHealth(server);

  registerShutdown(server, [
    () => prisma.$disconnect(),
    async () => {
      await redis.quit();
    },
  ]);

  await server.listen({ port: env.PORT, host: '0.0.0.0' });
}

start().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
