import { z } from 'zod';

import { protectedProcedure, router } from '../../trpc';
import {
  createOneProductInputSchema,
  createOneVendorInputSchema,
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

  createOneProduct: protectedProcedure
    .input(createOneProductInputSchema)
    .output(hubInventoryProductOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const { priority, quantity, notes, ...productFields } = input;
      const product = await ctx.hubInventoryAccessLayer.createOneProduct({
        where: { hubId: ctx.comrade.hubId },
        data: {
          createdById: ctx.comrade.id,
          ...productFields,
          notes: null,
        },
      });
      await ctx.hubListAccessLayer.createOneListItem({
        where: { hubId: ctx.comrade.hubId },
        data: {
          createdById: ctx.comrade.id,
          productId: product.id,
          priority,
          quantity,
          notes,
        },
      });
      return product;
    }),

  createOneVendor: protectedProcedure
    .input(createOneVendorInputSchema)
    .output(hubInventoryVendorOutputSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.hubInventoryAccessLayer.createOneVendor({
        where: { hubId: ctx.comrade.hubId },
        data: input,
      });
    }),
});
