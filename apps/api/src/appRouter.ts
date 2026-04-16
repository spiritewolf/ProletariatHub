import { authRouter } from './domains/auth';
import { comradeRouter } from './domains/comrade';
import { hubInventoryRouter } from './domains/hubInventory';
import { hubListRouter } from './domains/hubList';
import { peripheryRouter } from './domains/periphery';
import { router } from './trpc';

export const appRouter = router({
  auth: authRouter,
  comrade: comradeRouter,
  hubInventory: hubInventoryRouter,
  hubList: hubListRouter,
  periphery: peripheryRouter,
});

export type AppRouter = typeof appRouter;
