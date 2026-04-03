import { z } from 'zod';

export const serviceTileCategorySchema = z.enum(['media', 'tools', 'other']);

export const serviceTileSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  url: z.string().url(),
  description: z.string().nullable(),
  iconUrl: z.string().nullable(),
  category: serviceTileCategorySchema,
  sortOrder: z.number().int(),
});

export const serviceTilesListResponseSchema = z.object({
  serviceTiles: z.array(serviceTileSchema),
});

export const createServiceTileBodySchema = z.object({
  name: z.string().trim().min(1).max(100),
  url: z.string().url(),
  description: z.string().trim().max(1000).optional(),
  iconUrl: z.string().url().optional(),
  category: serviceTileCategorySchema.optional().default('media'),
  sortOrder: z.number().int().optional(),
});

export const createServiceTileResponseSchema = z.object({
  serviceTile: serviceTileSchema,
});

export const updateServiceTileBodySchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  url: z.string().url().optional(),
  description: z.union([z.string().trim().max(1000), z.null()]).optional(),
  iconUrl: z.union([z.string().url(), z.null()]).optional(),
  category: serviceTileCategorySchema.optional(),
  sortOrder: z.number().int().optional(),
});

export const updateServiceTileResponseSchema = z.object({
  serviceTile: serviceTileSchema,
});

export type ServiceTile = z.infer<typeof serviceTileSchema>;
export type CreateServiceTileBody = z.infer<typeof createServiceTileBodySchema>;
