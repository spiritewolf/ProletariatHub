import {
  choreListItemSchema,
  dashboardComradeRowSchema,
  dashboardDocsPreviewSchema,
  dashboardReminderRowSchema,
  type DashboardShoppingItemWidget,
  dashboardShoppingItemWidgetSchema,
  dashboardSummarySchema,
} from '@proletariat-hub/contracts';
import type { InferSelectModel } from 'drizzle-orm';
import { and, asc, count, desc, eq, isNull } from 'drizzle-orm';
import type { FastifyPluginAsync } from 'fastify';

import { attachSession, requirePasswordGateCleared, requireSetupComplete } from '../auth/hooks.js';
import { isHubRotationEnabled } from '../chores/rotation.js';
import { db } from '../db/index.js';
import {
  chores,
  comrades,
  contacts,
  credentialEntries,
  hubs,
  referenceNotes,
  shoppingListItems,
  shoppingLists,
} from '../db/schema.js';
import { listVisibleUpcomingReminderRows } from '../reminders/listVisibleUpcomingReminderRows.js';
import { ensureDefaultHubShoppingList } from '../shopping/ensureDefaultHubShoppingList.js';
import { ensureDefaultPersonalShoppingList } from '../shopping/ensureDefaultPersonalShoppingList.js';
import { listVisibleOpenTodos } from '../todos/listVisibleOpenTodos.js';

type ShoppingListItemRow = InferSelectModel<typeof shoppingListItems>;

function priorityRank(priority: string): number {
  if (priority === 'urgent') {
    return 0;
  }
  if (priority === 'medium') {
    return 1;
  }
  return 2;
}

function mapOpenShoppingRows(
  rows: Array<{ item: ShoppingListItemRow; listName: string }>,
): DashboardShoppingItemWidget[] {
  const sorted = [...rows].sort((a, b) => {
    const pr = priorityRank(a.item.priority) - priorityRank(b.item.priority);
    if (pr !== 0) {
      return pr;
    }
    return a.item.name.localeCompare(b.item.name);
  });
  return sorted.map(({ item, listName }) =>
    dashboardShoppingItemWidgetSchema.parse({
      id: item.id,
      name: item.name,
      category: item.category,
      priority: item.priority,
      purchaseType: item.purchaseType,
      listName,
    }),
  );
}

export const dashboardRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', attachSession);
  fastify.addHook('preHandler', requirePasswordGateCleared);
  fastify.addHook('preHandler', requireSetupComplete);

  fastify.get('/summary', async (req) => {
    const comrade = req.comrade!;
    const hub = db.select().from(hubs).where(eq(hubs.id, comrade.hubId)).get()!;
    const d = new Date();
    const today = d.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    ensureDefaultHubShoppingList(comrade.hubId);

    const hubItemJoin = db
      .select({
        item: shoppingListItems,
        listName: shoppingLists.name,
      })
      .from(shoppingListItems)
      .innerJoin(shoppingLists, eq(shoppingListItems.listId, shoppingLists.id))
      .where(
        and(
          eq(shoppingLists.hubId, comrade.hubId),
          eq(shoppingLists.listKind, 'hub'),
          isNull(shoppingLists.ownerComradeId),
          isNull(shoppingListItems.orderedAt),
        ),
      )
      .orderBy(asc(shoppingListItems.sortOrder), asc(shoppingListItems.addedAt))
      .all();

    const personalListId = ensureDefaultPersonalShoppingList(
      comrade.hubId,
      comrade.id,
      comrade.username,
    );

    const personalItemJoin = db
      .select({
        item: shoppingListItems,
        listName: shoppingLists.name,
      })
      .from(shoppingListItems)
      .innerJoin(shoppingLists, eq(shoppingListItems.listId, shoppingLists.id))
      .where(and(eq(shoppingListItems.listId, personalListId), isNull(shoppingListItems.orderedAt)))
      .orderBy(asc(shoppingListItems.sortOrder), asc(shoppingListItems.addedAt))
      .all();

    const hubShoppingItems = mapOpenShoppingRows(hubItemJoin);
    const personalShoppingItems = mapOpenShoppingRows(personalItemJoin);

    const comradeRows = db
      .select({
        id: comrades.id,
        username: comrades.username,
        isAdmin: comrades.isAdmin,
      })
      .from(comrades)
      .where(eq(comrades.hubId, comrade.hubId))
      .orderBy(asc(comrades.username))
      .all();

    const comradesPayload = comradeRows.map((row) =>
      dashboardComradeRowSchema.parse({
        id: row.id,
        username: row.username,
        isAdmin: row.isAdmin,
      }),
    );

    const choreJoinRows = db
      .select({
        chore: chores,
        assigneeUsername: comrades.username,
      })
      .from(chores)
      .innerJoin(comrades, eq(chores.assignedComradeId, comrades.id))
      .where(eq(chores.hubId, comrade.hubId))
      .orderBy(asc(chores.title))
      .all();

    const choresAssigned = choreJoinRows.map(({ chore, assigneeUsername }) =>
      choreListItemSchema.parse({
        id: chore.id,
        title: chore.title,
        description: chore.description,
        frequency: chore.frequency,
        assignedComradeId: chore.assignedComradeId,
        assigneeUsername,
        lastCompletedAt: chore.lastCompletedAt ?? null,
        nextDueAt: chore.nextDueAt ?? null,
        annoyingModeEnabled: chore.annoyingModeEnabled,
        rotateAcrossHub: isHubRotationEnabled(chore.frequencyRuleJson),
      }),
    );

    const allOpen = [...hubShoppingItems, ...personalShoppingItems];
    const urgentOpenCount = allOpen.filter((i) => i.priority === 'urgent').length;
    const openShoppingCount = allOpen.length;

    const statusParts: string[] = [];
    if (openShoppingCount > 0) {
      statusParts.push(
        `${openShoppingCount} shopping item${openShoppingCount === 1 ? '' : 's'} open`,
      );
    } else {
      statusParts.push('Shopping lists clear');
    }
    if (choresAssigned.length > 0) {
      statusParts.push(`${choresAssigned.length} chore${choresAssigned.length === 1 ? '' : 's'}`);
    } else {
      statusParts.push('No chores yet');
    }

    const todosAssigned = listVisibleOpenTodos(comrade.hubId, comrade.id);
    if (todosAssigned.length > 0) {
      statusParts.push(
        `${todosAssigned.length} to-do${todosAssigned.length === 1 ? '' : 's'} open`,
      );
    } else {
      statusParts.push('No open to-dos');
    }

    const upcomingReminders = listVisibleUpcomingReminderRows(comrade.hubId, comrade.id, {
      maxRows: 500,
    });
    if (upcomingReminders.length > 0) {
      statusParts.push(
        `${upcomingReminders.length} reminder${upcomingReminders.length === 1 ? '' : 's'} upcoming`,
      );
    } else {
      statusParts.push('No reminders');
    }

    const calendarPreview = upcomingReminders.slice(0, 12).map((r) =>
      dashboardReminderRowSchema.parse({
        id: r.id,
        title: r.title,
        category: r.category,
        eventDate: r.eventDate,
        eventTime: r.eventTime ?? null,
        status: r.status,
      }),
    );

    const hubId = comrade.hubId;
    const referenceNoteCount = Number(
      db.select({ c: count() }).from(referenceNotes).where(eq(referenceNotes.hubId, hubId)).get()
        ?.c ?? 0,
    );
    const credentialCount = Number(
      db
        .select({ c: count() })
        .from(credentialEntries)
        .where(eq(credentialEntries.hubId, hubId))
        .get()?.c ?? 0,
    );
    const contactCount = Number(
      db.select({ c: count() }).from(contacts).where(eq(contacts.hubId, hubId)).get()?.c ?? 0,
    );
    const recentNoteRows = db
      .select({ id: referenceNotes.id, title: referenceNotes.title })
      .from(referenceNotes)
      .where(eq(referenceNotes.hubId, hubId))
      .orderBy(desc(referenceNotes.updatedAt))
      .limit(5)
      .all();
    const docsPreview = dashboardDocsPreviewSchema.parse({
      referenceNoteCount,
      credentialCount,
      contactCount,
      recentNotes: recentNoteRows.map((r) => ({ id: r.id, title: r.title })),
    });

    const payload = {
      greeting: `★ Hey ${comrade.username}, the collective awaits.`,
      today,
      hubName: hub.name,
      statusLine: statusParts.join(' · '),
      urgentOpenCount,
      openShoppingCount,
      hubShoppingItems,
      personalShoppingItems,
      comrades: comradesPayload,
      choresAssigned,
      todosAssigned,
      calendarPreview,
      docsPreview,
    };
    return dashboardSummarySchema.parse(payload);
  });
};
