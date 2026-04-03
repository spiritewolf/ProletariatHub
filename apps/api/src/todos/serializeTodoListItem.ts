import { type TodoListItem, todoListItemSchema } from '@proletariat-hub/contracts';
import type { InferSelectModel } from 'drizzle-orm';

import { todos } from '../db/schema.js';

type TodoRow = InferSelectModel<typeof todos>;

export function serializeTodoListItem(
  row: TodoRow,
  creatorUsername: string,
  assigneeUsername: string | null,
): TodoListItem {
  return todoListItemSchema.parse({
    id: row.id,
    title: row.title,
    category: row.category,
    visibility: row.visibility,
    assignedComradeId: row.assignedComradeId,
    assigneeUsername,
    createdByComradeId: row.createdByComradeId,
    creatorUsername,
    recurrence: row.recurrence,
    dueDate: row.dueDate,
    dueTime: row.dueTime,
    annoyingModeEnabled: row.annoyingModeEnabled,
    status: row.status,
    lastCompletedAt: row.lastCompletedAt ?? null,
    nextDueAt: row.nextDueAt ?? null,
    completedAt: row.completedAt ?? null,
  });
}
