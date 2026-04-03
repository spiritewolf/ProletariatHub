import { randomUUID } from 'node:crypto';

import {
  choreListItemSchema,
  choresListResponseSchema,
  completeChoreBodySchema,
  completeChoreResponseSchema,
  createChoreBodySchema,
  createChoreResponseSchema,
} from '@proletariat-hub/contracts';
import type { InferSelectModel } from 'drizzle-orm';
import { and, asc, eq } from 'drizzle-orm';
import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

import { attachSession, requirePasswordGateCleared, requireSetupComplete } from '../auth/hooks.js';
import {
  buildChoreFrequencyRuleJson,
  isHubRotationEnabled,
  nextHubRotatingAssigneeId,
} from '../chores/rotation.js';
import { db } from '../db/index.js';
import { choreCompletions, chores, comrades } from '../db/schema.js';
import { parseJsonBody } from '../lib/parseJsonBody.js';

type ChoreRow = InferSelectModel<typeof chores>;

const choreIdParamSchema = z.object({
  choreId: z.uuid(),
});

function serializeChoreListItem(chore: ChoreRow, assigneeUsername: string) {
  return choreListItemSchema.parse({
    id: chore.id,
    title: chore.title,
    description: chore.description,
    frequency: chore.frequency,
    assignedComradeId: chore.assignedComradeId,
    assigneeUsername,
    lastCompletedAt: chore.lastCompletedAt ?? null,
    nextDueAt: chore.nextDueAt ?? null,
    annoyingModeEnabled: chore.annoyingModeEnabled,
    rotateAcrossHub: isHubRotationEnabled(chore.frequencyRuleJson),
  });
}

function assertAssigneeInHub(hubId: string, comradeId: string): boolean {
  const row = db
    .select({ id: comrades.id })
    .from(comrades)
    .where(and(eq(comrades.id, comradeId), eq(comrades.hubId, hubId)))
    .get();
  return row !== undefined;
}

export const choresRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', attachSession);
  fastify.addHook('preHandler', requirePasswordGateCleared);
  fastify.addHook('preHandler', requireSetupComplete);

  fastify.get('/', async (req) => {
    const hubId = req.comrade!.hubId;
    const rows = db
      .select({
        chore: chores,
        assigneeUsername: comrades.username,
      })
      .from(chores)
      .innerJoin(comrades, eq(chores.assignedComradeId, comrades.id))
      .where(eq(chores.hubId, hubId))
      .orderBy(asc(chores.title))
      .all();

    const list = rows.map(({ chore, assigneeUsername }) =>
      serializeChoreListItem(chore, assigneeUsername),
    );
    return choresListResponseSchema.parse({ chores: list });
  });

  fastify.post('/', async (req, reply) => {
    const hubId = req.comrade!.hubId;
    const body = parseJsonBody(createChoreBodySchema, req.body, reply);
    if (body === null) {
      return;
    }
    if (!assertAssigneeInHub(hubId, body.assignedComradeId)) {
      return reply.status(400).send({ error: 'Assignee is not in this hub' });
    }

    const id = randomUUID();
    const now = Date.now();
    db.insert(chores)
      .values({
        id,
        hubId,
        title: body.title,
        description: body.description ?? null,
        assignedComradeId: body.assignedComradeId,
        frequency: body.frequency ?? 'weekly',
        frequencyRuleJson: buildChoreFrequencyRuleJson(body.rotateAcrossHub ?? false),
        lastCompletedAt: null,
        nextDueAt: null,
        annoyingModeEnabled: body.annoyingModeEnabled ?? false,
        createdAt: now,
        updatedAt: now,
      })
      .run();

    const created = db.select().from(chores).where(eq(chores.id, id)).get()!;
    const assignee = db
      .select({ username: comrades.username })
      .from(comrades)
      .where(eq(comrades.id, created.assignedComradeId))
      .get()!;

    return createChoreResponseSchema.parse({
      chore: serializeChoreListItem(created, assignee.username),
    });
  });

  fastify.post<{ Params: { choreId: string } }>('/:choreId/complete', async (req, reply) => {
    const paramsParsed = choreIdParamSchema.safeParse(req.params);
    if (!paramsParsed.success) {
      return reply.status(400).send({ error: 'Invalid chore id' });
    }
    const { choreId } = paramsParsed.data;
    const hubId = req.comrade!.hubId;
    const comrade = req.comrade!;

    const body = parseJsonBody(completeChoreBodySchema, req.body ?? {}, reply);
    if (body === null) {
      return;
    }

    const choreRow = db.select().from(chores).where(eq(chores.id, choreId)).get();
    if (!choreRow || choreRow.hubId !== hubId) {
      return reply.status(404).send({ error: 'Chore not found' });
    }

    const completionId = randomUUID();
    const now = Date.now();
    db.insert(choreCompletions)
      .values({
        id: completionId,
        choreId,
        completedAt: now,
        completedByComradeId: comrade.id,
        completedBy: 'comrade',
        notes: body.notes ?? null,
      })
      .run();

    const nextAssignedComradeId = isHubRotationEnabled(choreRow.frequencyRuleJson)
      ? nextHubRotatingAssigneeId(hubId, choreRow.assignedComradeId)
      : choreRow.assignedComradeId;

    db.update(chores)
      .set({
        assignedComradeId: nextAssignedComradeId,
        lastCompletedAt: now,
        nextDueAt: null,
        updatedAt: now,
      })
      .where(eq(chores.id, choreId))
      .run();

    const updated = db.select().from(chores).where(eq(chores.id, choreId)).get()!;
    const assignee = db
      .select({ username: comrades.username })
      .from(comrades)
      .where(eq(comrades.id, updated.assignedComradeId))
      .get()!;

    return completeChoreResponseSchema.parse({
      chore: serializeChoreListItem(updated, assignee.username),
    });
  });
};
