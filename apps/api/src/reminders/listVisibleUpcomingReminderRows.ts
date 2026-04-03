import type { InferSelectModel } from 'drizzle-orm';
import { and, asc, eq, gte, inArray, sql } from 'drizzle-orm';

import { db } from '../db/index.js';
import { calendarEventComrades, calendarEvents } from '../db/schema.js';
import { todayIsoDate } from '../lib/todayIsoDate.js';

type CalendarEventRow = InferSelectModel<typeof calendarEvents>;

/**
 * Upcoming hub events from `minDate` onward, visible to the comrade:
 * no `calendar_event_comrades` rows → hub-wide; otherwise only listed comrades.
 */
export function listVisibleUpcomingReminderRows(
  hubId: string,
  comradeId: string,
  options: { maxRows: number; minDate?: string },
): CalendarEventRow[] {
  const minDate = options.minDate ?? todayIsoDate();
  const rows = db
    .select()
    .from(calendarEvents)
    .where(
      and(
        eq(calendarEvents.hubId, hubId),
        eq(calendarEvents.status, 'upcoming'),
        gte(calendarEvents.eventDate, minDate),
      ),
    )
    .orderBy(
      asc(calendarEvents.eventDate),
      sql`CASE WHEN ${calendarEvents.eventTime} IS NULL THEN 1 ELSE 0 END`,
      asc(calendarEvents.eventTime),
    )
    .all();

  if (rows.length === 0) {
    return [];
  }

  const eventIds = rows.map((r) => r.id);
  const assignmentRows = db
    .select()
    .from(calendarEventComrades)
    .where(inArray(calendarEventComrades.eventId, eventIds))
    .all();

  const assignedByEvent = new Map<string, string[]>();
  for (const a of assignmentRows) {
    const list = assignedByEvent.get(a.eventId) ?? [];
    list.push(a.comradeId);
    assignedByEvent.set(a.eventId, list);
  }

  const visible = rows.filter((e) => {
    const assigned = assignedByEvent.get(e.id);
    if (!assigned || assigned.length === 0) {
      return true;
    }
    return assigned.includes(comradeId);
  });

  return visible.slice(0, options.maxRows);
}
