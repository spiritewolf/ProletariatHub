import { eq } from 'drizzle-orm';
import type { FastifyPluginAsync } from 'fastify';
import { dashboardSummarySchema } from '@proletariat-hub/contracts';
import { attachSession, requirePasswordGateCleared, requireSetupComplete } from '../auth/hooks.js';
import { db } from '../db/index.js';
import { hubs } from '../db/schema.js';

export const dashboardRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', attachSession);
  fastify.addHook('preHandler', requirePasswordGateCleared);
  fastify.addHook('preHandler', requireSetupComplete);

  fastify.get('/summary', async (req) => {
    const hub = db.select().from(hubs).where(eq(hubs.id, req.comrade!.hubId)).get()!;
    const d = new Date();
    const today = d.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const payload = {
      greeting: `Hey ${req.comrade!.username}, the collective awaits.`,
      today,
      hubName: hub.name,
      urgentLine: null,
      choresAssigned: [],
      todosAssigned: [],
      shoppingPreview: [],
      calendarPreview: [],
      docsPreview: null,
    };
    return dashboardSummarySchema.parse(payload);
  });
};
