import type { FastifyReply } from 'fastify';
import type { ZodType } from 'zod';

/**
 * Validates JSON body with Zod. On failure, sends 400 and returns null.
 */
export function parseJsonBody<T>(schema: ZodType<T>, body: unknown, reply: FastifyReply): T | null {
  const result = schema.safeParse(body);
  if (result.success) {
    return result.data;
  }
  const firstIssue = result.error.issues[0];
  const message = firstIssue?.message ?? 'Invalid request body';
  void reply.status(400).send({ error: message });
  return null;
}
