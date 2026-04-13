import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

import type { Context } from './context';
import { requireSessionComrade } from './middleware/session-comrade';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const sessionToComrade = t.middleware(async ({ ctx, next }) => {
  const comrade = await requireSessionComrade({ req: ctx.req, db: ctx.db });
  return next({
    ctx: {
      ...ctx,
      comrade,
    },
  });
});

export const protectedProcedure = t.procedure.use(sessionToComrade);
