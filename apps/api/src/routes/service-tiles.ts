import { randomUUID } from 'node:crypto';

import {
  createServiceTileBodySchema,
  createServiceTileResponseSchema,
  serviceTileSchema,
  serviceTilesListResponseSchema,
  updateServiceTileBodySchema,
  updateServiceTileResponseSchema,
} from '@proletariat-hub/contracts';
import type { InferSelectModel } from 'drizzle-orm';
import { and, asc, eq, max } from 'drizzle-orm';
import type { FastifyPluginAsync, FastifyReply } from 'fastify';
import { z } from 'zod';

import { attachSession, requirePasswordGateCleared, requireSetupComplete } from '../auth/hooks.js';
import { db } from '../db/index.js';
import { serviceTiles } from '../db/schema.js';
import { parseJsonBody } from '../lib/parseJsonBody.js';

type ServiceTileRow = InferSelectModel<typeof serviceTiles>;

const serviceTileIdParamSchema = z.object({
  serviceTileId: z.uuid(),
});

function serializeServiceTile(row: ServiceTileRow) {
  return serviceTileSchema.parse({
    id: row.id,
    name: row.name,
    url: row.url,
    description: row.description ?? null,
    iconUrl: row.iconUrl ?? null,
    category: row.category,
    sortOrder: row.sortOrder,
  });
}

function ensureAdminOrReply(isAdmin: boolean, reply: FastifyReply): boolean {
  if (isAdmin) {
    return true;
  }
  void reply.status(403).send({ error: 'Admin access required' });
  return false;
}

export const serviceTilesRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', attachSession);
  fastify.addHook('preHandler', requirePasswordGateCleared);
  fastify.addHook('preHandler', requireSetupComplete);

  fastify.get('/', async (req) => {
    const hubId = req.comrade!.hubId;
    const rows = db
      .select()
      .from(serviceTiles)
      .where(eq(serviceTiles.hubId, hubId))
      .orderBy(asc(serviceTiles.sortOrder), asc(serviceTiles.name))
      .all();
    return serviceTilesListResponseSchema.parse({
      serviceTiles: rows.map((row) => serializeServiceTile(row)),
    });
  });

  fastify.post('/', async (req, reply) => {
    const comrade = req.comrade!;
    if (!ensureAdminOrReply(comrade.isAdmin, reply)) {
      return;
    }
    const body = parseJsonBody(createServiceTileBodySchema, req.body, reply);
    if (body === null) {
      return;
    }
    const maxSort = db
      .select({ m: max(serviceTiles.sortOrder) })
      .from(serviceTiles)
      .where(eq(serviceTiles.hubId, comrade.hubId))
      .get();
    const nextSortOrder = Number(maxSort?.m ?? -1) + 1;
    const id = randomUUID();
    const now = Date.now();
    db.insert(serviceTiles)
      .values({
        id,
        hubId: comrade.hubId,
        name: body.name,
        url: body.url,
        description: body.description ?? null,
        iconUrl: body.iconUrl ?? null,
        category: body.category,
        sortOrder: body.sortOrder ?? nextSortOrder,
        createdAt: now,
        updatedAt: now,
      })
      .run();
    const created = db.select().from(serviceTiles).where(eq(serviceTiles.id, id)).get()!;
    return createServiceTileResponseSchema.parse({
      serviceTile: serializeServiceTile(created),
    });
  });

  fastify.patch<{ Params: { serviceTileId: string } }>('/:serviceTileId', async (req, reply) => {
    const comrade = req.comrade!;
    if (!ensureAdminOrReply(comrade.isAdmin, reply)) {
      return;
    }
    const paramsParsed = serviceTileIdParamSchema.safeParse(req.params);
    if (!paramsParsed.success) {
      return reply.status(400).send({ error: 'Invalid service tile id' });
    }
    const body = parseJsonBody(updateServiceTileBodySchema, req.body, reply);
    if (body === null) {
      return;
    }
    if (
      body.name === undefined &&
      body.url === undefined &&
      body.description === undefined &&
      body.iconUrl === undefined &&
      body.category === undefined &&
      body.sortOrder === undefined
    ) {
      return reply.status(400).send({ error: 'No fields to update' });
    }
    const existing = db
      .select()
      .from(serviceTiles)
      .where(
        and(
          eq(serviceTiles.id, paramsParsed.data.serviceTileId),
          eq(serviceTiles.hubId, comrade.hubId),
        ),
      )
      .get();
    if (existing === undefined) {
      return reply.status(404).send({ error: 'Service tile not found' });
    }
    const now = Date.now();
    db.update(serviceTiles)
      .set({
        name: body.name ?? existing.name,
        url: body.url ?? existing.url,
        description: body.description !== undefined ? body.description : existing.description,
        iconUrl: body.iconUrl !== undefined ? body.iconUrl : existing.iconUrl,
        category: body.category ?? existing.category,
        sortOrder: body.sortOrder ?? existing.sortOrder,
        updatedAt: now,
      })
      .where(eq(serviceTiles.id, existing.id))
      .run();
    const updated = db.select().from(serviceTiles).where(eq(serviceTiles.id, existing.id)).get()!;
    return updateServiceTileResponseSchema.parse({
      serviceTile: serializeServiceTile(updated),
    });
  });

  fastify.delete<{ Params: { serviceTileId: string } }>('/:serviceTileId', async (req, reply) => {
    const comrade = req.comrade!;
    if (!ensureAdminOrReply(comrade.isAdmin, reply)) {
      return;
    }
    const paramsParsed = serviceTileIdParamSchema.safeParse(req.params);
    if (!paramsParsed.success) {
      return reply.status(400).send({ error: 'Invalid service tile id' });
    }
    const result = db
      .delete(serviceTiles)
      .where(
        and(
          eq(serviceTiles.id, paramsParsed.data.serviceTileId),
          eq(serviceTiles.hubId, comrade.hubId),
        ),
      )
      .run();
    if (result.changes === 0) {
      return reply.status(404).send({ error: 'Service tile not found' });
    }
    return reply.status(204).send();
  });
};
