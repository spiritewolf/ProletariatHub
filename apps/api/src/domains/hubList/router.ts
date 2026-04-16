import { protectedProcedure, router } from '../../trpc';
import { hubListOutputSchema } from './schemas';

export const hubListRouter = router({
  findUniqueHubList: protectedProcedure.output(hubListOutputSchema).query(async ({ ctx }) => {
    return ctx.hubListAccessLayer.findUnique({
      where: { hubId: ctx.comrade.hubId },
    });
  }),
});
