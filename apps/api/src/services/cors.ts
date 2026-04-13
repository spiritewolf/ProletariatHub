import cors from '@fastify/cors';
import type { ServerEnv } from '@proletariat-hub/config';
import type { FastifyInstance } from 'fastify';

export async function registerCors(server: FastifyInstance, env: ServerEnv): Promise<void> {
  await server.register(cors, {
    origin: env.WEB_ORIGIN,
    credentials: true,
  });
}
