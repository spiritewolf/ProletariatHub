import type { FastifyReply, FastifyRequest } from 'fastify';

import { SESSION_COOKIE } from './constants.js';
import { loadComradeBySessionId, touchSession } from './session.js';

export async function attachSession(req: FastifyRequest, reply: FastifyReply) {
  const sid = req.cookies[SESSION_COOKIE];
  if (!sid) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }
  const loaded = loadComradeBySessionId(sid);
  if (!loaded) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }
  touchSession(sid);
  req.sessionId = loaded.sessionId;
  req.comrade = loaded.comrade;
}

export async function requirePasswordGateCleared(req: FastifyRequest, reply: FastifyReply) {
  if (req.comrade?.mustChangePassword) {
    return reply.status(403).send({
      error: 'Change your password before continuing.',
      code: 'MUST_CHANGE_PASSWORD',
    });
  }
}

export async function requireSetupComplete(req: FastifyRequest, reply: FastifyReply) {
  if (!req.comrade?.hasCompletedSetup) {
    return reply.status(403).send({
      error: 'Complete setup before entering the dashboard.',
      code: 'SETUP_REQUIRED',
    });
  }
}
