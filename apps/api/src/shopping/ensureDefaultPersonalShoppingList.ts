import { and, eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { db } from '../db/index.js';
import { shoppingLists } from '../db/schema.js';

/**
 * Ensures the Comrade has a default `personal` shopping list for this Hub.
 * Returns that list's id.
 */
export function ensureDefaultPersonalShoppingList(
  hubId: string,
  comradeId: string,
  username: string,
): string {
  const existing = db
    .select()
    .from(shoppingLists)
    .where(
      and(
        eq(shoppingLists.hubId, hubId),
        eq(shoppingLists.listKind, 'personal'),
        eq(shoppingLists.ownerComradeId, comradeId),
      ),
    )
    .limit(1)
    .get();

  if (existing) {
    return existing.id;
  }

  const id = randomUUID();
  const now = Date.now();
  const label = username.trim().length > 0 ? username.trim() : 'Comrade';

  db.insert(shoppingLists)
    .values({
      id,
      hubId,
      name: `${label}'s list`,
      listKind: 'personal',
      ownerComradeId: comradeId,
      createdByComradeId: comradeId,
      notifiedComradeIds: null,
      summaryFrequency: 'weekly',
      createdAt: now,
      updatedAt: now,
    })
    .run();

  return id;
}
