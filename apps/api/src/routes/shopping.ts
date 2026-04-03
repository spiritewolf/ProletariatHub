import { randomUUID } from 'node:crypto';

import {
  createShoppingItemBodySchema,
  createShoppingItemResponseSchema,
  markShoppingItemOrderedBodySchema,
  markShoppingItemReopenedBodySchema,
  shoppingItemSingleResponseSchema,
  shoppingItemsQuerySchema,
  shoppingItemsResponseSchema,
  shoppingListRowSchema,
  shoppingListsResponseSchema,
} from '@proletariat-hub/contracts';
import { and, asc, count, desc, eq, isNotNull, isNull, max } from 'drizzle-orm';
import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

import { attachSession, requirePasswordGateCleared, requireSetupComplete } from '../auth/hooks.js';
import { db } from '../db/index.js';
import { shoppingListItems, shoppingLists } from '../db/schema.js';
import { parseJsonBody } from '../lib/parseJsonBody.js';
import { ensureDefaultHubShoppingList } from '../shopping/ensureDefaultHubShoppingList.js';
import { ensureDefaultPersonalShoppingList } from '../shopping/ensureDefaultPersonalShoppingList.js';
import { serializeShoppingItemRow } from '../shopping/serialize.js';

const listIdParamSchema = z.object({
  listId: z.uuid(),
});

const listAndItemParamSchema = z.object({
  listId: z.uuid(),
  itemId: z.uuid(),
});

export const shoppingRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', attachSession);
  fastify.addHook('preHandler', requirePasswordGateCleared);
  fastify.addHook('preHandler', requireSetupComplete);

  fastify.get('/lists', async (req) => {
    const comrade = req.comrade!;
    const hubId = comrade.hubId;
    ensureDefaultHubShoppingList(hubId);
    ensureDefaultPersonalShoppingList(hubId, comrade.id, comrade.username);

    const lists = db.select().from(shoppingLists).where(eq(shoppingLists.hubId, hubId)).all();

    const listsWithCounts = lists.map((list) => {
      const countRow = db
        .select({ c: count() })
        .from(shoppingListItems)
        .where(and(eq(shoppingListItems.listId, list.id), isNull(shoppingListItems.orderedAt)))
        .get();
      const itemCount = Number(countRow?.c ?? 0);
      return shoppingListRowSchema.parse({
        id: list.id,
        hubId: list.hubId,
        name: list.name,
        listKind: list.listKind,
        ownerComradeId: list.ownerComradeId,
        itemCount,
      });
    });

    return shoppingListsResponseSchema.parse({ lists: listsWithCounts });
  });

  fastify.get<{ Params: { listId: string }; Querystring: Record<string, unknown> }>(
    '/lists/:listId/items',
    async (req, reply) => {
      const paramsParsed = listIdParamSchema.safeParse(req.params);
      if (!paramsParsed.success) {
        return reply.status(400).send({ error: 'Invalid list id' });
      }
      const { listId } = paramsParsed.data;
      const hubId = req.comrade!.hubId;

      const list = db.select().from(shoppingLists).where(eq(shoppingLists.id, listId)).get();
      if (!list || list.hubId !== hubId) {
        return reply.status(404).send({ error: 'List not found' });
      }

      const queryParsed = shoppingItemsQuerySchema.safeParse(req.query);
      if (!queryParsed.success) {
        return reply.status(400).send({ error: 'Invalid query' });
      }
      const status = queryParsed.data.status ?? 'open';

      let rows;
      if (status === 'open') {
        rows = db
          .select()
          .from(shoppingListItems)
          .where(and(eq(shoppingListItems.listId, listId), isNull(shoppingListItems.orderedAt)))
          .orderBy(asc(shoppingListItems.sortOrder), asc(shoppingListItems.addedAt))
          .all();
      } else if (status === 'ordered') {
        rows = db
          .select()
          .from(shoppingListItems)
          .where(and(eq(shoppingListItems.listId, listId), isNotNull(shoppingListItems.orderedAt)))
          .orderBy(desc(shoppingListItems.orderedAt))
          .all();
      } else {
        const allRows = db
          .select()
          .from(shoppingListItems)
          .where(eq(shoppingListItems.listId, listId))
          .all();
        rows = [...allRows].sort((a, b) => {
          const aOpen = a.orderedAt === null;
          const bOpen = b.orderedAt === null;
          if (aOpen !== bOpen) {
            return aOpen ? -1 : 1;
          }
          if (aOpen && bOpen) {
            return a.sortOrder - b.sortOrder || a.addedAt - b.addedAt;
          }
          return (b.orderedAt ?? 0) - (a.orderedAt ?? 0);
        });
      }

      const items = rows.map(serializeShoppingItemRow);
      return shoppingItemsResponseSchema.parse({ items });
    },
  );

  fastify.post<{ Params: { listId: string } }>('/lists/:listId/items', async (req, reply) => {
    const paramsParsed = listIdParamSchema.safeParse(req.params);
    if (!paramsParsed.success) {
      return reply.status(400).send({ error: 'Invalid list id' });
    }
    const { listId } = paramsParsed.data;
    const hubId = req.comrade!.hubId;

    const list = db.select().from(shoppingLists).where(eq(shoppingLists.id, listId)).get();
    if (!list || list.hubId !== hubId) {
      return reply.status(404).send({ error: 'List not found' });
    }

    const body = parseJsonBody(createShoppingItemBodySchema, req.body, reply);
    if (!body) {
      return;
    }

    const priority = body.priority ?? 'medium';
    const purchaseType = body.purchaseType ?? 'either';
    const isOneTime = body.isOneTime ?? false;

    const maxRow = db
      .select({ m: max(shoppingListItems.sortOrder) })
      .from(shoppingListItems)
      .where(and(eq(shoppingListItems.listId, listId), isNull(shoppingListItems.orderedAt)))
      .get();
    const nextSort = (maxRow?.m ?? -1) + 1;

    const now = Date.now();
    const id = randomUUID();

    db.insert(shoppingListItems)
      .values({
        id,
        listId,
        name: body.name,
        category: body.category?.length ? body.category : null,
        vendor: null,
        purchaseType,
        priority,
        isOneTime,
        productCodeOrUrl: null,
        notes: body.notes?.length ? body.notes : null,
        addedByComradeId: req.comrade!.id,
        addedAt: now,
        orderedByComradeId: null,
        orderedAt: null,
        lastEscalatedAt: null,
        sortOrder: nextSort,
        createdAt: now,
        updatedAt: now,
      })
      .run();

    const row = db.select().from(shoppingListItems).where(eq(shoppingListItems.id, id)).get()!;
    const item = serializeShoppingItemRow(row);
    const responsePayload = createShoppingItemResponseSchema.parse({ item });
    return reply.status(201).send(responsePayload);
  });

  fastify.post<{ Params: { listId: string; itemId: string } }>(
    '/lists/:listId/items/:itemId/mark-ordered',
    async (req, reply) => {
      const paramsParsed = listAndItemParamSchema.safeParse(req.params);
      if (!paramsParsed.success) {
        return reply.status(400).send({ error: 'Invalid list or item id' });
      }
      const { listId, itemId } = paramsParsed.data;
      const hubId = req.comrade!.hubId;

      const list = db.select().from(shoppingLists).where(eq(shoppingLists.id, listId)).get();
      if (!list || list.hubId !== hubId) {
        return reply.status(404).send({ error: 'List not found' });
      }

      if (parseJsonBody(markShoppingItemOrderedBodySchema, req.body ?? {}, reply) === null) {
        return;
      }

      const existing = db
        .select()
        .from(shoppingListItems)
        .where(eq(shoppingListItems.id, itemId))
        .get();

      if (!existing || existing.listId !== listId) {
        return reply.status(404).send({ error: 'Item not found' });
      }

      const now = Date.now();
      const comradeId = req.comrade!.id;

      if (existing.orderedAt !== null) {
        const item = serializeShoppingItemRow(existing);
        return shoppingItemSingleResponseSchema.parse({ item });
      }

      db.update(shoppingListItems)
        .set({
          orderedAt: now,
          orderedByComradeId: comradeId,
          updatedAt: now,
        })
        .where(eq(shoppingListItems.id, itemId))
        .run();

      const row = db
        .select()
        .from(shoppingListItems)
        .where(eq(shoppingListItems.id, itemId))
        .get()!;
      const item = serializeShoppingItemRow(row);
      return shoppingItemSingleResponseSchema.parse({ item });
    },
  );

  fastify.post<{ Params: { listId: string; itemId: string } }>(
    '/lists/:listId/items/:itemId/mark-reopened',
    async (req, reply) => {
      const paramsParsed = listAndItemParamSchema.safeParse(req.params);
      if (!paramsParsed.success) {
        return reply.status(400).send({ error: 'Invalid list or item id' });
      }
      const { listId, itemId } = paramsParsed.data;
      const hubId = req.comrade!.hubId;

      const list = db.select().from(shoppingLists).where(eq(shoppingLists.id, listId)).get();
      if (!list || list.hubId !== hubId) {
        return reply.status(404).send({ error: 'List not found' });
      }

      if (parseJsonBody(markShoppingItemReopenedBodySchema, req.body ?? {}, reply) === null) {
        return;
      }

      const existing = db
        .select()
        .from(shoppingListItems)
        .where(eq(shoppingListItems.id, itemId))
        .get();

      if (!existing || existing.listId !== listId) {
        return reply.status(404).send({ error: 'Item not found' });
      }

      if (existing.orderedAt === null) {
        const item = serializeShoppingItemRow(existing);
        return shoppingItemSingleResponseSchema.parse({ item });
      }

      const now = Date.now();
      db.update(shoppingListItems)
        .set({
          orderedAt: null,
          orderedByComradeId: null,
          updatedAt: now,
        })
        .where(eq(shoppingListItems.id, itemId))
        .run();

      const row = db
        .select()
        .from(shoppingListItems)
        .where(eq(shoppingListItems.id, itemId))
        .get()!;
      const item = serializeShoppingItemRow(row);
      return shoppingItemSingleResponseSchema.parse({ item });
    },
  );
};
