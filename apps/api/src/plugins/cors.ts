import cors from '@fastify/cors';
import { DEPLOYMENT_ENV, type ServerEnv } from '@proletariat-hub/config';
import type { FastifyInstance } from 'fastify';

/**
 * In development, browsers may send `Origin: http://127.0.0.1:5173` while `.env` uses
 * `http://localhost:5173` (or the reverse). A single strict origin then blocks credentialed
 * tRPC calls and the UI shows "Cannot reach the hub server".
 */
function developmentCorsOrigins(webOrigin: string): string[] {
  let parsed: URL;
  try {
    parsed = new URL(webOrigin);
  } catch {
    return [webOrigin];
  }
  const alternateHost =
    parsed.hostname === 'localhost'
      ? '127.0.0.1'
      : parsed.hostname === '127.0.0.1'
        ? 'localhost'
        : null;
  if (alternateHost === null) {
    return [webOrigin];
  }
  const alternate = new URL(webOrigin);
  alternate.hostname = alternateHost;
  const altOrigin = alternate.origin;
  return altOrigin === webOrigin ? [webOrigin] : [webOrigin, altOrigin];
}

export async function registerCors(server: FastifyInstance, env: ServerEnv): Promise<void> {
  const origin =
    env.NODE_ENV === DEPLOYMENT_ENV.DEVELOPMENT
      ? developmentCorsOrigins(env.WEB_ORIGIN)
      : env.WEB_ORIGIN;

  await server.register(cors, {
    origin,
    credentials: true,
  });
}
