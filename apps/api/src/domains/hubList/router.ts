import { z } from 'zod';

import { protectedProcedure, router } from '../../trpc';
import {
  claimManyListItemsInputSchema,
  claimOneListItemInputSchema,
  createOneListItemInputSchema,
  hubListItemOutputSchema,
  hubListOutputSchema,
  unclaimManyListItemsInputSchema,
  unclaimOneListItemInputSchema,
} from './schemas';

export const hubListRouter = router({
  findUniqueHubList: protectedProcedure.output(hubListOutputSchema).query(async ({ ctx }) => {
    return ctx.hubListAccessLayer.findFirst({
      where: { hubId: ctx.comrade.hubId },
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

  claimOneListItem: protectedProcedure
    .input(claimOneListItemInputSchema)
    .output(hubListItemOutputSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.hubListAccessLayer.claimOneListItem({
        where: { listItemId: input.listItemId },
        data: { claimedById: ctx.comrade.id },
      });
    }),

  claimManyListItems: protectedProcedure
    .input(claimManyListItemsInputSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.hubListAccessLayer.claimManyListItems({
        where: { listItemIds: input.listItemIds },
        data: { claimedById: ctx.comrade.id },
      });
    }),

  unclaimOneListItem: protectedProcedure
    .input(unclaimOneListItemInputSchema)
    .output(hubListItemOutputSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.hubListAccessLayer.unclaimOneListItem({
        where: { listItemId: input.listItemId },
      });
    }),

  unclaimManyListItems: protectedProcedure
    .input(unclaimManyListItemsInputSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.hubListAccessLayer.unclaimManyListItems({
        where: { listItemIds: input.listItemIds },
      });
    }),
});
