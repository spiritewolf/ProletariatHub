import { randomUUID } from 'node:crypto';

import { eq } from 'drizzle-orm';

import { db } from '../db/index.js';
import { comrades, sessions } from '../db/schema.js';

export type ComradeRow = typeof comrades.$inferSelect;

export function loadComradeBySessionId(sessionId: string): {
  sessionId: string;
  comrade: ComradeRow;
} | null {
  const sess = db.select().from(sessions).where(eq(sessions.id, sessionId)).get();
  if (!sess) return null;
  const comrade = db.select().from(comrades).where(eq(comrades.id, sess.comradeId)).get();
  if (!comrade) return null;
  return { sessionId, comrade };
}

export function createSession(comradeId: string): string {
  const id = randomUUID();
  const now = Date.now();
  db.insert(sessions)
    .values({
      id,
      comradeId: comradeId,
      createdAt: now,
      lastSeenAt: now,
    })
    .run();
  return id;
}

export function destroySession(sessionId: string): void {
  db.delete(sessions).where(eq(sessions.id, sessionId)).run();
}

export function touchSession(sessionId: string): void {
  db.update(sessions).set({ lastSeenAt: Date.now() }).where(eq(sessions.id, sessionId)).run();
}
