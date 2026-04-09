import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

type ApiContext = {
  req: unknown;
  res: unknown;
  db: unknown;
  redis: unknown;
};

const t = initTRPC.context<ApiContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
