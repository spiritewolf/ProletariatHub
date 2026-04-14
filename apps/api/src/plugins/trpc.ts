import {
  type CreateFastifyContextOptions,
  fastifyTRPCPlugin,
  type FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify';
import type { FastifyInstance } from 'fastify';

import { type AppRouter, appRouter } from '../appRouter';
import type { PublicContext } from '../types/context';

export type CreateContextFn = (opts: CreateFastifyContextOptions) => Promise<PublicContext>;

export async function registerTrpc(
  server: FastifyInstance,
  opts: { createContext: CreateContextFn },
): Promise<void> {
  await server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
      router: appRouter,
      createContext: opts.createContext,
    } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
  });
}
