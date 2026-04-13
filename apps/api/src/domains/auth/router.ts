import { protectedProcedure, publicProcedure, router } from '../../trpc';
import { comradeOutputSchema, loginInputSchema } from './schemas';
import {
  createOneLoginSession,
  deleteOneLoginSession,
  findFirstComradeFromSession,
} from './session';

export const authRouter = router({
  createOneLoginSession: publicProcedure
    .input(loginInputSchema)
    .output(comradeOutputSchema)
    .mutation(async ({ ctx, input }) => {
      return createOneLoginSession({ db: ctx.db, req: ctx.req, input });
    }),
  findFirstComradeFromSession: publicProcedure
    .output(comradeOutputSchema.nullable())
    .query(async ({ ctx }) => {
      return findFirstComradeFromSession({ db: ctx.db, req: ctx.req });
    }),
  deleteOneLoginSession: protectedProcedure.mutation(async ({ ctx }): Promise<void> => {
    await deleteOneLoginSession({ req: ctx.req });
  }),
});
