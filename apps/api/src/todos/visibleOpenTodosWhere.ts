import { and, eq, or, type SQL } from 'drizzle-orm';

import { todos } from '../db/schema.js';

/** Open todos the comrade may see (hub / assigned-to-me / private mine). */
export function visibleOpenTodosCondition(hubId: string, comradeId: string): SQL {
  return and(
    eq(todos.hubId, hubId),
    eq(todos.status, 'open'),
    or(
      eq(todos.visibility, 'hub'),
      and(eq(todos.visibility, 'assigned'), eq(todos.assignedComradeId, comradeId)),
      and(eq(todos.visibility, 'private'), eq(todos.createdByComradeId, comradeId)),
    ),
  )!;
}
