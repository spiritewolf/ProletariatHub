import '../types/fastifyAugmentation.js';

import cookie from '@fastify/cookie';
import session from '@fastify/session';
import { DEPLOYMENT_ENV, type ServerEnv } from '@proletariat-hub/config';
import type { FastifyInstance } from 'fastify';
import type Redis from 'ioredis';

import { createSessionStore, SESSION_MAX_AGE_MS } from '../shared/redis';

export async function registerSession(
  server: FastifyInstance,
  redis: Redis,
  env: ServerEnv,
): Promise<void> {
  const sessionStore = createSessionStore(redis);

  await server.register(cookie);

  await server.register(session, {
    secret: env.SESSION_SECRET,
    cookieName: 'sessionId',
    store: sessionStore,
    cookie: {
      path: '/',
      httpOnly: true,
      secure: env.NODE_ENV === DEPLOYMENT_ENV.PRODUCTION,
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE_MS,
    },
    saveUninitialized: false,
  });
}
