import { asc, eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '../db/index.js';
import { comrades } from '../db/schema.js';

type ChoreRotationRule = {
  assignment: 'rotate_hub';
};

const choreRotationRuleSchema = z.object({
  assignment: z.literal('rotate_hub'),
});

function parseChoreRotationRule(raw: string | null): ChoreRotationRule | null {
  if (raw === null) {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    const validated = choreRotationRuleSchema.safeParse(parsed);
    if (validated.success) {
      return validated.data;
    }
  } catch {
    return null;
  }
  return null;
}

export function isHubRotationEnabled(frequencyRuleJson: string | null): boolean {
  return parseChoreRotationRule(frequencyRuleJson) !== null;
}

export function buildChoreFrequencyRuleJson(rotateAcrossHub: boolean): string | null {
  if (!rotateAcrossHub) {
    return null;
  }
  return JSON.stringify({ assignment: 'rotate_hub' } satisfies ChoreRotationRule);
}

/** Next assignee in hub username order, wrapping around. */
export function nextHubRotatingAssigneeId(hubId: string, currentAssigneeId: string): string {
  const rows = db
    .select({ id: comrades.id })
    .from(comrades)
    .where(eq(comrades.hubId, hubId))
    .orderBy(asc(comrades.username), asc(comrades.id))
    .all();

  if (rows.length === 0) {
    return currentAssigneeId;
  }
  if (rows.length === 1) {
    return rows[0].id;
  }

  const currentIdx = rows.findIndex((row) => row.id === currentAssigneeId);
  if (currentIdx < 0) {
    return rows[0].id;
  }
  const nextIdx = (currentIdx + 1) % rows.length;
  return rows[nextIdx].id;
}
