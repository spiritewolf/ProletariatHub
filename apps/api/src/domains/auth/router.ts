import { protectedProcedure, publicProcedure, router } from '../../trpc';
import { comradeOutputSchema } from '../comrade';
import { loginInputSchema } from './schemas';
import {
  createOneLoginSession,
  deleteOneLoginSession,
  findUniqueComradeFromSession,
} from './session';

export const authRouter = router({
  createOneLoginSession: publicProcedure
    .input(loginInputSchema)
    .output(comradeOutputSchema)
    .mutation(async ({ ctx, input }) => {
      return createOneLoginSession({
        comradeAccessLayer: ctx.comradeAccessLayer,
        req: ctx.req,
        input,
      });
    }),
  findUniqueComradeFromSession: publicProcedure
    .output(comradeOutputSchema.nullable())
    .query(async ({ ctx }) => {
      return findUniqueComradeFromSession({
        comradeAccessLayer: ctx.comradeAccessLayer,
        req: ctx.req,
      });
    }),
  deleteOneLoginSession: protectedProcedure.mutation(async ({ ctx }): Promise<void> => {
    await deleteOneLoginSession({ req: ctx.req });
  }),
});
