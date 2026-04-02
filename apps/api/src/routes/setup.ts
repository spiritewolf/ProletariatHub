import { and, eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import type { FastifyPluginAsync, FastifyReply } from 'fastify';
import {
  hubPatchBodySchema,
  hubPatchResponseSchema,
  setupComradeBodySchema,
  setupComradesListResponseSchema,
  setupCompleteResponseSchema,
  setupCreateComradeResponseSchema,
} from '@proletariat-hub/contracts';
import { attachSession, requirePasswordGateCleared } from '../auth/hooks.js';
import { serializeAuthenticatedComrade } from '../auth/serialize.js';
import { db } from '../db/index.js';
import { comrades, hubs } from '../db/schema.js';
import { parseJsonBody } from '../lib/parseJsonBody.js';
import { hashPassword } from '../lib/password.js';

function assertAdmin(reply: FastifyReply, isAdmin: boolean) {
  if (!isAdmin) {
    return reply.status(403).send({
      error: 'Only the Admin may shape the Hub at this stage.',
    });
  }
  return undefined;
}

export const setupRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', attachSession);
  fastify.addHook('preHandler', requirePasswordGateCleared);

  fastify.get('/comrades', async (req, reply) => {
    const denied = assertAdmin(reply, req.comrade!.isAdmin);
    if (denied) {
      return denied;
    }
    const rows = db
      .select({
        id: comrades.id,
        username: comrades.username,
        isAdmin: comrades.isAdmin,
        createdAt: comrades.createdAt,
        notificationPhone: comrades.notificationPhone,
      })
      .from(comrades)
      .where(eq(comrades.hubId, req.comrade!.hubId))
      .all();
    return setupComradesListResponseSchema.parse({ comrades: rows });
  });

  fastify.patch('/hub', async (req, reply) => {
    const denied = assertAdmin(reply, req.comrade!.isAdmin);
    if (denied) {
      return denied;
    }
    const body = parseJsonBody(hubPatchBodySchema, req.body, reply);
    if (!body) {
      return;
    }
    db.update(hubs).set({ name: body.name }).where(eq(hubs.id, req.comrade!.hubId)).run();
    const hub = db.select().from(hubs).where(eq(hubs.id, req.comrade!.hubId)).get()!;
    return hubPatchResponseSchema.parse({
      hub: { id: hub.id, name: hub.name },
    });
  });

  fastify.post('/comrades', async (req, reply) => {
    const denied = assertAdmin(reply, req.comrade!.isAdmin);
    if (denied) {
      return denied;
    }
    const body = parseJsonBody(setupComradeBodySchema, req.body, reply);
    if (!body) {
      return;
    }

    const hubId = req.comrade!.hubId;
    const taken = db
      .select()
      .from(comrades)
      .where(and(eq(comrades.hubId, hubId), eq(comrades.username, body.username)))
      .get();
    if (taken) {
      return reply.status(409).send({ error: 'That username is already in the collective.' });
    }

    const plainPassword =
      body.password !== undefined && body.password.length > 0 ? body.password : 'password';

    const phoneRaw = body.notificationPhone;
    const notificationPhone = phoneRaw !== undefined && phoneRaw.length > 0 ? phoneRaw : null;

    const now = Date.now();
    const id = randomUUID();
    db.insert(comrades)
      .values({
        id,
        hubId,
        username: body.username,
        passwordHash: hashPassword(plainPassword),
        isAdmin: false,
        hasCompletedSetup: false,
        mustChangePassword: true,
        notificationPhone,
        notificationSignal: null,
        notificationNtfyTopic: null,
        icon: null,
        createdAt: now,
      })
      .run();
    const row = db.select().from(comrades).where(eq(comrades.id, id)).get()!;
    const responseBody = setupCreateComradeResponseSchema.parse({
      comrade: {
        id: row.id,
        username: row.username,
        isAdmin: row.isAdmin,
      },
    });
    return reply.status(201).send(responseBody);
  });

  fastify.post('/complete', async (req, reply) => {
    const denied = assertAdmin(reply, req.comrade!.isAdmin);
    if (denied) {
      return denied;
    }
    db.update(comrades)
      .set({ hasCompletedSetup: true })
      .where(eq(comrades.id, req.comrade!.id))
      .run();
    const row = db.select().from(comrades).where(eq(comrades.id, req.comrade!.id)).get()!;
    const hub = db.select().from(hubs).where(eq(hubs.id, row.hubId)).get()!;
    const comrade = serializeAuthenticatedComrade(row, hub.name);
    return setupCompleteResponseSchema.parse({
      ok: true as const,
      comrade,
    });
  });
};
