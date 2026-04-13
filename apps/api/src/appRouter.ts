import { authRouter } from './domains/auth/router';
import { comradeRouter } from './domains/comrade/router';
import { router } from './trpc';

export const appRouter = router({
  auth: authRouter,
  comrade: comradeRouter,
});

export type AppRouter = typeof appRouter;
