import { authRouter } from './domains/auth';
import { comradeRouter } from './domains/comrade';
import { router } from './trpc';

export const appRouter = router({
  auth: authRouter,
  comrade: comradeRouter,
});

export type AppRouter = typeof appRouter;
