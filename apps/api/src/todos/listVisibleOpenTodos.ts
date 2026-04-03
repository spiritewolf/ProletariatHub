import { asc, inArray } from 'drizzle-orm';
import type { TodoListItem } from '@proletariat-hub/contracts';
import { db } from '../db/index.js';
import { comrades, todos } from '../db/schema.js';
import { serializeTodoListItem } from './serializeTodoListItem.js';
import { visibleOpenTodosCondition } from './visibleOpenTodosWhere.js';

export function listVisibleOpenTodos(hubId: string, comradeId: string): TodoListItem[] {
  const rows = db
    .select()
    .from(todos)
    .where(visibleOpenTodosCondition(hubId, comradeId))
    .orderBy(asc(todos.title))
    .all();

  if (rows.length === 0) {
    return [];
  }

  const ids = new Set<string>();
  for (const t of rows) {
    ids.add(t.createdByComradeId);
    if (t.assignedComradeId) {
      ids.add(t.assignedComradeId);
    }
  }
  const idList = [...ids];
  const nameRows = db
    .select({ id: comrades.id, username: comrades.username })
    .from(comrades)
    .where(inArray(comrades.id, idList))
    .all();
  const names = new Map(nameRows.map((r) => [r.id, r.username]));

  return rows.map((row) =>
    serializeTodoListItem(
      row,
      names.get(row.createdByComradeId) ?? '?',
      row.assignedComradeId ? (names.get(row.assignedComradeId) ?? null) : null,
    ),
  );
}
