import { ComradeRole } from '@proletariat-hub/types';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

import { requireAuthenticatedComrade } from './middleware/requireAuthenticatedComrade';
import type { PublicContext } from './types/context';

const t = initTRPC.context<PublicContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const withAuthenticatedComrade = (params: { requireAdmin: boolean }) =>
  t.middleware(async ({ ctx, next }) => {
    const comrade = await requireAuthenticatedComrade({
      req: ctx.req,
      comradeAccessLayer: ctx.comradeAccessLayer,
    });
    if (params.requireAdmin && comrade.role !== ComradeRole.ADMIN) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Admin access required',
      });
    }
    return next({
      ctx: {
        ...ctx,
        comrade,
      },
    });
  });

export const protectedProcedure = t.procedure.use(
  withAuthenticatedComrade({ requireAdmin: false }),
);

export const adminProcedure = t.procedure.use(withAuthenticatedComrade({ requireAdmin: true }));
