import { z } from 'zod';

import { adminProcedure, router } from '../../trpc';
import {
  createOnePeripheryInputSchema,
  peripheryOutputSchema,
  updateOnePeripheryInputSchema,
} from './schemas';

export const peripheryRouter = router({
  createOnePeriphery: adminProcedure
    .input(createOnePeripheryInputSchema)
    .output(peripheryOutputSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.peripheryAccessLayer.createOne({
        hubId: ctx.comrade.hubId,
        comradeId: ctx.comrade.id,
        input,
      });
    }),

  findManyPeriphery: adminProcedure
    .output(z.array(peripheryOutputSchema))
    .query(async ({ ctx }) => {
      return ctx.peripheryAccessLayer.findMany({
        where: { hubId: ctx.comrade.hubId },
      });
    }),

  updateOnePeriphery: adminProcedure
    .input(updateOnePeripheryInputSchema)
    .output(peripheryOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...patch } = input;
      return ctx.peripheryAccessLayer.updateOne({
        where: { id },
        input: patch,
      });
    }),

  archiveOnePeriphery: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.peripheryAccessLayer.archiveOne({ id: input.id });
    }),
});
