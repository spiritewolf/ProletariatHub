import { router } from '@proletariat-hub/api/trpc';

export const appRouter = router({
  _internal: router({}),
});

export type AppRouter = typeof appRouter;
