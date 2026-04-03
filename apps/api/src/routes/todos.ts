import {
  completeTodoBodySchema,
  completeTodoResponseSchema,
  createTodoBodySchema,
  createTodoResponseSchema,
  todosListResponseSchema,
} from '@proletariat-hub/contracts';
import { and, eq } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { attachSession, requirePasswordGateCleared, requireSetupComplete } from '../auth/hooks.js';
import { db } from '../db/index.js';
import { comrades, todos } from '../db/schema.js';
import { parseJsonBody } from '../lib/parseJsonBody.js';
import { listVisibleOpenTodos } from '../todos/listVisibleOpenTodos.js';
import { serializeTodoListItem } from '../todos/serializeTodoListItem.js';

const todoIdParamSchema = z.object({
  todoId: z.uuid(),
});

function assertComradeInHub(hubId: string, comradeId: string): boolean {
  const row = db
    .select({ id: comrades.id })
    .from(comrades)
    .where(and(eq(comrades.id, comradeId), eq(comrades.hubId, hubId)))
    .get();
  return row !== undefined;
}

type TodoRow = InferSelectModel<typeof todos>;

function canCompleteTodo(todo: TodoRow, comradeId: string): boolean {
  if (todo.visibility === 'hub') {
    return true;
  }
  if (todo.visibility === 'private') {
    return todo.createdByComradeId === comradeId;
  }
  return (
    todo.assignedComradeId === comradeId || todo.createdByComradeId === comradeId
  );
}

function loadTodoWithNames(todoId: string) {
  const row = db.select().from(todos).where(eq(todos.id, todoId)).get();
  if (!row) {
    return null;
  }
  const creator = db
    .select({ username: comrades.username })
    .from(comrades)
    .where(eq(comrades.id, row.createdByComradeId))
    .get();
  const assigneeUsername =
    row.assignedComradeId == null
      ? null
      : db
          .select({ username: comrades.username })
          .from(comrades)
          .where(eq(comrades.id, row.assignedComradeId))
          .get()?.username ?? null;
  if (!creator) {
    return null;
  }
  return { row, creatorUsername: creator.username, assigneeUsername };
}

export const todosRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', attachSession);
  fastify.addHook('preHandler', requirePasswordGateCleared);
  fastify.addHook('preHandler', requireSetupComplete);

  fastify.get('/', async (req) => {
    const comrade = req.comrade!;
    const list = listVisibleOpenTodos(comrade.hubId, comrade.id);
    return todosListResponseSchema.parse({ todos: list });
  });

  fastify.post('/', async (req, reply) => {
    const comrade = req.comrade!;
    const hubId = comrade.hubId;
    const body = parseJsonBody(createTodoBodySchema, req.body, reply);
    if (body === null) {
      return;
    }

    if (body.visibility === 'assigned' && body.assignedComradeId != null) {
      if (!assertComradeInHub(hubId, body.assignedComradeId)) {
        return reply.status(400).send({ error: 'Assignee is not in this hub' });
      }
    }
    if (
      body.visibility === 'hub' &&
      body.assignedComradeId != null &&
      !assertComradeInHub(hubId, body.assignedComradeId)
    ) {
      return reply.status(400).send({ error: 'Assignee is not in this hub' });
    }

    const id = randomUUID();
    const now = Date.now();
    const assignedId =
      body.visibility === 'hub'
        ? (body.assignedComradeId ?? null)
        : body.visibility === 'assigned'
          ? body.assignedComradeId!
          : null;

    db.insert(todos)
      .values({
        id,
        hubId,
        createdByComradeId: comrade.id,
        title: body.title,
        category: body.category ?? null,
        visibility: body.visibility,
        assignedComradeId: assignedId ?? null,
        dueDate: body.dueDate ?? null,
        dueTime: body.dueTime ?? null,
        recurrence: body.recurrence ?? 'one_time',
        notifyBeforeJson: null,
        annoyingModeEnabled: body.annoyingModeEnabled ?? false,
        notes: body.notes ?? null,
        status: 'open',
        lastCompletedAt: null,
        nextDueAt: null,
        completedAt: null,
        createdAt: now,
        updatedAt: now,
      })
      .run();

    const loaded = loadTodoWithNames(id);
    if (!loaded) {
      return reply.status(500).send({ error: 'Failed to load created todo' });
    }
    return createTodoResponseSchema.parse({
      todo: serializeTodoListItem(
        loaded.row,
        loaded.creatorUsername,
        loaded.assigneeUsername,
      ),
    });
  });

  fastify.post<{ Params: { todoId: string } }>('/:todoId/complete', async (req, reply) => {
    const paramsParsed = todoIdParamSchema.safeParse(req.params);
    if (!paramsParsed.success) {
      return reply.status(400).send({ error: 'Invalid todo id' });
    }
    const { todoId } = paramsParsed.data;
    const comrade = req.comrade!;

    const body = parseJsonBody(completeTodoBodySchema, req.body ?? {}, reply);
    if (body === null) {
      return;
    }

    const todoRow = db.select().from(todos).where(eq(todos.id, todoId)).get();
    if (!todoRow || todoRow.hubId !== comrade.hubId) {
      return reply.status(404).send({ error: 'Todo not found' });
    }
    if (todoRow.status !== 'open') {
      return reply.status(400).send({ error: 'Todo is not open' });
    }
    if (!canCompleteTodo(todoRow, comrade.id)) {
      return reply.status(403).send({ error: 'Not allowed to complete this todo' });
    }

    const now = Date.now();
    db.update(todos)
      .set({
        status: 'completed',
        completedAt: now,
        lastCompletedAt: now,
        nextDueAt: null,
        updatedAt: now,
      })
      .where(eq(todos.id, todoId))
      .run();

    const loaded = loadTodoWithNames(todoId);
    if (!loaded) {
      return reply.status(500).send({ error: 'Failed to load todo' });
    }
    return completeTodoResponseSchema.parse({
      todo: serializeTodoListItem(
        loaded.row,
        loaded.creatorUsername,
        loaded.assigneeUsername,
      ),
    });
  });
};
