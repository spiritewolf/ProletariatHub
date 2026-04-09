import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import session from '@fastify/session';
import { createContext } from '@proletariat-hub/api/context';
import { type AppRouter, appRouter } from '@proletariat-hub/api/router';
import { registerHealthRoutes } from '@proletariat-hub/api/routes/health';
import { getRedis, initRedis } from '@proletariat-hub/api/shared/lib/redis';
import { validateEnv } from '@proletariat-hub/config';
import { prisma } from '@proletariat-hub/db';
import { fastifyTRPCPlugin, type FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';

const env = validateEnv();
initRedis(env.REDIS_URL);

const server = fastify({
  logger: true,
  routerOptions: {
    maxParamLength: 5000,
  },
});

let isShuttingDown = false;

async function shutdown(signal: NodeJS.Signals) {
  if (isShuttingDown) {
    process.exit(1);
  }
  isShuttingDown = true;
  server.log.info({ signal }, 'Shutting down');
  try {
    await server.close();
    await prisma.$disconnect();
    await getRedis().quit();
  } catch (err: unknown) {
    server.log.error(err);
  }
  process.exit(0);
}

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});
process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

async function start() {
  const corsOrigin = env.NODE_ENV === 'production' ? false : env.WEB_ORIGIN;

  await server.register(cors, {
    origin: corsOrigin,
    credentials: true,
  });

  await server.register(cookie);

  await server.register(session, {
    secret: env.SESSION_SECRET,
    cookieName: 'sessionId',
    cookie: {
      path: '/',
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
    },
  });

  await server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
      router: appRouter,
      createContext,
    } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
  });

  await registerHealthRoutes(server);
  await server.listen({ port: env.PORT, host: '0.0.0.0' });
}

start().catch((err: unknown) => {
  server.log.error(err);
  process.exit(1);
});
