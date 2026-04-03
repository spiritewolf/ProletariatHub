import { randomUUID } from 'node:crypto';

import { and, eq, isNull } from 'drizzle-orm';

import { db } from '../db/index.js';
import { shoppingLists } from '../db/schema.js';

/**
 * Ensures the Hub has at least one shared (`hub` kind, no owner) shopping list.
 * Returns that list's id.
 */
export function ensureDefaultHubShoppingList(hubId: string): string {
  const existing = db
    .select()
    .from(shoppingLists)
    .where(
      and(
        eq(shoppingLists.hubId, hubId),
        eq(shoppingLists.listKind, 'hub'),
        isNull(shoppingLists.ownerComradeId),
      ),
    )
    .limit(1)
    .get();

  if (existing) {
    return existing.id;
  }

  const id = randomUUID();
  const now = Date.now();
  db.insert(shoppingLists)
    .values({
      id,
      hubId,
      name: 'Household',
      listKind: 'hub',
      ownerComradeId: null,
      createdByComradeId: null,
      notifiedComradeIds: null,
      summaryFrequency: 'weekly',
      createdAt: now,
      updatedAt: now,
    })
    .run();

  return id;
}
