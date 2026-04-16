import { z } from 'zod';

import { protectedProcedure, router } from '../../trpc';
import {
  findManyHubInventoryProductsInputSchema,
  hubInventoryProductCategoryOutputSchema,
  hubInventoryProductOutputSchema,
  hubInventoryVendorOutputSchema,
} from './schemas';

export const hubInventoryRouter = router({
  findManyProducts: protectedProcedure
    .input(findManyHubInventoryProductsInputSchema)
    .output(z.array(hubInventoryProductOutputSchema))
    .query(async ({ ctx, input }) => {
      const searchText = input?.searchText;
      return ctx.hubInventoryAccessLayer.findManyProducts({
        where: { hubId: ctx.comrade.hubId, searchText },
      });
    }),

  findManyCategories: protectedProcedure
    .output(z.array(hubInventoryProductCategoryOutputSchema))
    .query(async ({ ctx }) => {
      return ctx.hubInventoryAccessLayer.findManyCategories({
        where: { hubId: ctx.comrade.hubId },
      });
    }),

  findManyVendors: protectedProcedure
    .output(z.array(hubInventoryVendorOutputSchema))
    .query(async ({ ctx }) => {
      return ctx.hubInventoryAccessLayer.findManyVendors({
        where: { hubId: ctx.comrade.hubId },
      });
    }),
});
