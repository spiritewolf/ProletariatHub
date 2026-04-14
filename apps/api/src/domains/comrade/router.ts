import { ComradeOnboardStatus, ComradeRole } from '@proletariat-hub/types';
import { TRPCError } from '@trpc/server';

import { protectedProcedure, router } from '../../trpc';
import {
  completeAdminSetupInputSchema,
  completeMemberSetupInputSchema,
  comradeOutputSchema,
} from './schemas';

export const comradeRouter = router({
  completeAdminSetup: protectedProcedure
    .input(completeAdminSetupInputSchema)
    .output(comradeOutputSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.comrade.role !== ComradeRole.ADMIN) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin setup only' });
      }
      if (ctx.comrade.onboardStatus === ComradeOnboardStatus.COMPLETE) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Setup already completed' });
      }
      return ctx.comradeAccessLayer.completeAdminSetup({
        comrade: ctx.comrade,
        input,
      });
    }),

  completeMemberSetup: protectedProcedure
    .input(completeMemberSetupInputSchema)
    .output(comradeOutputSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.comrade.role === ComradeRole.ADMIN) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Member setup only' });
      }
      if (ctx.comrade.onboardStatus === ComradeOnboardStatus.COMPLETE) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Setup already completed' });
      }
      return ctx.comradeAccessLayer.completeMemberSetup({
        comrade: ctx.comrade,
        input,
      });
    }),
});
