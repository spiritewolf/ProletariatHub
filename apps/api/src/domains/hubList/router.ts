import { z } from 'zod';

import { protectedProcedure, router } from '../../trpc';
import {
  createOneListItemInputSchema,
  hubListItemOutputSchema,
  hubListOutputSchema,
} from './schemas';

export const hubListRouter = router({
  findUniqueHubList: protectedProcedure.output(hubListOutputSchema).query(async ({ ctx }) => {
    return ctx.hubListAccessLayer.findFirst({
      where: { hubId: ctx.comrade.hubId },
      orderBy: { priority: 'asc' },
    });
  }),

  createOneListItem: protectedProcedure
    .input(createOneListItemInputSchema)
    .output(hubListItemOutputSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.hubListAccessLayer.createOneListItem({
        where: { hubId: ctx.comrade.hubId },
        data: {
          createdById: ctx.comrade.id,
          ...input,
        },
      });
    }),

  removeOneListItem: protectedProcedure
    .input(z.object({ hubListId: z.string().uuid(), hubListItemId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.hubListAccessLayer.removeOneListItem({
        where: { hubListId: input.hubListId, hubListItemId: input.hubListItemId },
      });
    }),
});
