import { randomUUID } from 'node:crypto';

import {
  completeReminderResponseSchema,
  createReminderBodySchema,
  createReminderResponseSchema,
  reminderListItemSchema,
  remindersListResponseSchema,
} from '@proletariat-hub/contracts';
import type { InferSelectModel } from 'drizzle-orm';
import { and, eq } from 'drizzle-orm';
import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

import { attachSession, requirePasswordGateCleared, requireSetupComplete } from '../auth/hooks.js';
import { db } from '../db/index.js';
import { calendarEventComrades, calendarEvents, comrades } from '../db/schema.js';
import { parseJsonBody } from '../lib/parseJsonBody.js';
import { listVisibleUpcomingReminderRows } from '../reminders/listVisibleUpcomingReminderRows.js';

type CalendarEventRow = InferSelectModel<typeof calendarEvents>;

const reminderIdParamSchema = z.object({
  reminderId: z.uuid(),
});

function serializeReminderListItem(row: CalendarEventRow) {
  return reminderListItemSchema.parse({
    id: row.id,
    title: row.title,
    category: row.category,
    eventDate: row.eventDate,
    eventTime: row.eventTime ?? null,
    status: row.status,
    notes: row.notes ?? null,
    recurrence: row.recurrence,
  });
}

function assertComradesInHub(hubId: string, comradeIds: string[]): boolean {
  if (comradeIds.length === 0) {
    return true;
  }
  const unique = [...new Set(comradeIds)];
  for (const id of unique) {
    const row = db
      .select({ id: comrades.id })
      .from(comrades)
      .where(and(eq(comrades.id, id), eq(comrades.hubId, hubId)))
      .get();
    if (row === undefined) {
      return false;
    }
  }
  return true;
}

function isReminderVisibleToComrade(event: CalendarEventRow, comradeId: string): boolean {
  const assignments = db
    .select()
    .from(calendarEventComrades)
    .where(eq(calendarEventComrades.eventId, event.id))
    .all();
  if (assignments.length === 0) {
    return true;
  }
  return assignments.some((a) => a.comradeId === comradeId);
}

export const remindersRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', attachSession);
  fastify.addHook('preHandler', requirePasswordGateCleared);
  fastify.addHook('preHandler', requireSetupComplete);

  fastify.get('/', async (req) => {
    const hubId = req.comrade!.hubId;
    const comradeId = req.comrade!.id;
    const rows = listVisibleUpcomingReminderRows(hubId, comradeId, { maxRows: 500 });
    const list = rows.map((r) => serializeReminderListItem(r));
    return remindersListResponseSchema.parse({ reminders: list });
  });

  fastify.post('/', async (req, reply) => {
    const hubId = req.comrade!.hubId;
    const body = parseJsonBody(createReminderBodySchema, req.body, reply);
    if (body === null) {
      return;
    }
    if (!assertComradesInHub(hubId, body.assignedComradeIds)) {
      return reply.status(400).send({ error: 'Assigned comrade is not in this hub' });
    }

    const id = randomUUID();
    const now = Date.now();
    const eventTime = body.eventTime === undefined ? null : body.eventTime;

    db.transaction((tx) => {
      tx.insert(calendarEvents)
        .values({
          id,
          hubId,
          title: body.title,
          category: body.category,
          eventDate: body.eventDate,
          eventTime,
          recurrence: body.recurrence,
          recurrenceRuleJson: null,
          status: 'upcoming',
          notes: body.notes ?? null,
          notifyBeforeDays: 0,
          notifiedComradeIds: null,
          snoozedUntil: null,
          caldavUid: null,
          createdAt: now,
          updatedAt: now,
        })
        .run();

      for (const comradeId of body.assignedComradeIds) {
        tx.insert(calendarEventComrades).values({ eventId: id, comradeId }).run();
      }
    });

    const created = db.select().from(calendarEvents).where(eq(calendarEvents.id, id)).get()!;
    return createReminderResponseSchema.parse({
      reminder: serializeReminderListItem(created),
    });
  });

  fastify.post<{ Params: { reminderId: string } }>('/:reminderId/complete', async (req, reply) => {
    const paramsParsed = reminderIdParamSchema.safeParse(req.params);
    if (!paramsParsed.success) {
      return reply.status(400).send({ error: 'Invalid reminder id' });
    }
    const { reminderId } = paramsParsed.data;
    const hubId = req.comrade!.hubId;
    const comrade = req.comrade!;

    const row = db
      .select()
      .from(calendarEvents)
      .where(and(eq(calendarEvents.id, reminderId), eq(calendarEvents.hubId, hubId)))
      .get();
    if (row === undefined) {
      return reply.status(404).send({ error: 'Reminder not found' });
    }
    if (!isReminderVisibleToComrade(row, comrade.id)) {
      return reply.status(403).send({ error: 'Not allowed to update this reminder' });
    }

    const now = Date.now();
    db.update(calendarEvents)
      .set({ status: 'completed', updatedAt: now })
      .where(eq(calendarEvents.id, reminderId))
      .run();

    const updated = db
      .select()
      .from(calendarEvents)
      .where(eq(calendarEvents.id, reminderId))
      .get()!;
    return completeReminderResponseSchema.parse({
      reminder: serializeReminderListItem(updated),
    });
  });
};
