import { authRouter } from './domains/auth';
import { comradeRouter } from './domains/comrade';
import { peripheryRouter } from './domains/periphery';
import { router } from './trpc';

export const appRouter = router({
  auth: authRouter,
  comrade: comradeRouter,
  periphery: peripheryRouter,
});

export type AppRouter = typeof appRouter;
