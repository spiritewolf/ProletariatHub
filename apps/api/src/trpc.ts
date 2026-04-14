import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

import { requireSessionComrade } from './middleware/requireSessionComrade';
import type { Context } from './types/context';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const enforceAuthentication = t.middleware(async ({ ctx, next }) => {
  const comrade = await requireSessionComrade({
    req: ctx.req,
    comradeAccessLayer: ctx.comradeAccessLayer,
  });
  return next({
    ctx: {
      ...ctx,
      comrade,
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceAuthentication);
