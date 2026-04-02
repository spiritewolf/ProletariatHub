import type { ComradeRow } from '../auth/session.js';

declare module 'fastify' {
  interface FastifyRequest {
    comrade?: ComradeRow;
    sessionId?: string;
  }
}
