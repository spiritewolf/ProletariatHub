import { and, eq } from 'drizzle-orm';
import type { FastifyPluginAsync } from 'fastify';
import {
  accountPatchBodySchema,
  accountPatchResponseSchema,
  loginBodySchema,
  loginSuccessResponseSchema,
  sessionResponseSchema,
} from '@proletariat-hub/contracts';
import { SESSION_COOKIE } from '../auth/constants.js';
import { attachSession } from '../auth/hooks.js';
import { serializeAuthenticatedComrade } from '../auth/serialize.js';
import { createSession, destroySession } from '../auth/session.js';
import { db } from '../db/index.js';
import { comrades, hubs } from '../db/schema.js';
import { parseJsonBody } from '../lib/parseJsonBody.js';
import { hashPassword, verifyPassword } from '../lib/password.js';

function cookieOpts() {
  return {
    path: '/',
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.COOKIE_SECURE === 'true',
  };
}

export const authPublicRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/login', async (req, reply) => {
    const body = parseJsonBody(loginBodySchema, req.body, reply);
    if (!body) {
      return;
    }

    const hub = db.select().from(hubs).limit(1).get();
    if (!hub) {
      return reply.status(500).send({ error: 'No Hub seeded' });
    }

    const comradeRow = db
      .select()
      .from(comrades)
      .where(and(eq(comrades.hubId, hub.id), eq(comrades.username, body.username)))
      .get();

    if (!comradeRow || !verifyPassword(body.password, comradeRow.passwordHash)) {
      return reply.status(401).send({ error: 'Invalid username or password' });
    }

    const sessionId = createSession(comradeRow.id);
    const comrade = serializeAuthenticatedComrade(comradeRow, hub.name);
    const responseBody = loginSuccessResponseSchema.parse({
      ok: true as const,
      comrade,
    });

    return reply.setCookie(SESSION_COOKIE, sessionId, cookieOpts()).send(responseBody);
  });

  fastify.post('/logout', async (req, reply) => {
    const sid = req.cookies[SESSION_COOKIE];
    if (sid) {
      destroySession(sid);
    }
    return reply.clearCookie(SESSION_COOKIE, { path: '/' }).send({ ok: true as const });
  });
};

export const authSessionRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', attachSession);

  fastify.get('/session', async (req) => {
    const comradeRow = req.comrade!;
    const hub = db.select().from(hubs).where(eq(hubs.id, comradeRow.hubId)).get();
    const hubDisplayName = hub?.name ?? 'Hub';
    const comrade = serializeAuthenticatedComrade(comradeRow, hubDisplayName);
    return sessionResponseSchema.parse({ comrade });
  });

  fastify.patch('/account', async (req, reply) => {
    const comradeRow = req.comrade!;
    const body = parseJsonBody(accountPatchBodySchema, req.body, reply);
    if (!body) {
      return;
    }

    const currentPasswordOk = verifyPassword(body.currentPassword, comradeRow.passwordHash);
    if (!currentPasswordOk) {
      return reply.status(400).send({ error: 'Current password is incorrect' });
    }

    if (comradeRow.mustChangePassword) {
      const newPw = body.newPassword;
      if (newPw === undefined || newPw.length < 8) {
        return reply
          .status(400)
          .send({ error: 'New password must be at least 8 characters, Comrade.' });
      }
    }

    const nextUsername =
      body.newUsername !== undefined && body.newUsername.length > 0 ? body.newUsername : undefined;

    if (nextUsername !== undefined && nextUsername !== comradeRow.username) {
      const taken = db
        .select()
        .from(comrades)
        .where(and(eq(comrades.hubId, comradeRow.hubId), eq(comrades.username, nextUsername)))
        .get();
      if (taken) {
        return reply.status(409).send({ error: 'That username is already claimed in this Hub.' });
      }
    }

    let passwordHash = comradeRow.passwordHash;
    let mustChangePassword = comradeRow.mustChangePassword;
    let hasCompletedSetup = comradeRow.hasCompletedSetup;

    const newPasswordValue = body.newPassword;
    const wantsNewPassword = newPasswordValue !== undefined && newPasswordValue.length >= 8;
    if (wantsNewPassword) {
      passwordHash = hashPassword(newPasswordValue);
      mustChangePassword = false;
      if (!comradeRow.isAdmin) {
        hasCompletedSetup = true;
      }
    }

    const username = nextUsername ?? comradeRow.username;

    const nothingChanged =
      username === comradeRow.username &&
      passwordHash === comradeRow.passwordHash &&
      mustChangePassword === comradeRow.mustChangePassword &&
      hasCompletedSetup === comradeRow.hasCompletedSetup;

    if (nothingChanged) {
      const hub = db.select().from(hubs).where(eq(hubs.id, comradeRow.hubId)).get();
      const hubDisplayName = hub?.name ?? 'Hub';
      const comrade = serializeAuthenticatedComrade(comradeRow, hubDisplayName);
      return accountPatchResponseSchema.parse({ comrade });
    }

    db.update(comrades)
      .set({
        username,
        passwordHash,
        mustChangePassword,
        hasCompletedSetup,
      })
      .where(eq(comrades.id, comradeRow.id))
      .run();

    const updatedRow = db.select().from(comrades).where(eq(comrades.id, comradeRow.id)).get()!;
    const hub = db.select().from(hubs).where(eq(hubs.id, updatedRow.hubId)).get();
    const hubDisplayName = hub?.name ?? 'Hub';
    const comrade = serializeAuthenticatedComrade(updatedRow, hubDisplayName);
    return accountPatchResponseSchema.parse({ comrade });
  });
};
