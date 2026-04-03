import type { CreateTodoBody, TodoListItem } from '@proletariat-hub/contracts';
import { TodoVisibilityScope } from './todoVisibilityScope';

export { TodoVisibilityScope };

const TodoDashboardMetaCopy = {
  assignmentUnassigned: 'unassigned',
  assignmentYours: 'yours',
  creatorPrefix: 'by ',
  duePrefix: 'due ',
  noDueDate: 'no due date',
} as const;

export const TODO_VISIBILITY_DISPLAY_LABEL: Record<TodoVisibilityScope, string> = {
  [TodoVisibilityScope.Hub]: 'Hub',
  [TodoVisibilityScope.Assigned]: 'Assigned',
  [TodoVisibilityScope.Private]: 'Private',
};

export const TODO_VISIBILITY_FORM_OPTIONS: ReadonlyArray<{
  value: TodoVisibilityScope;
  label: string;
}> = [
  { value: TodoVisibilityScope.Hub, label: TODO_VISIBILITY_DISPLAY_LABEL[TodoVisibilityScope.Hub] },
  {
    value: TodoVisibilityScope.Assigned,
    label: TODO_VISIBILITY_DISPLAY_LABEL[TodoVisibilityScope.Assigned],
  },
  {
    value: TodoVisibilityScope.Private,
    label: TODO_VISIBILITY_DISPLAY_LABEL[TodoVisibilityScope.Private],
  },
];

export function getTodoVisibilityDisplayLabel(scope: TodoListItem['visibility']): string {
  return TODO_VISIBILITY_DISPLAY_LABEL[scope as TodoVisibilityScope];
}

export function formatDashboardTodoMetaLine(
  todo: TodoListItem,
  currentComradeId: string,
): string {
  const visibilityLabel = getTodoVisibilityDisplayLabel(todo.visibility);
  const assignmentSummary =
    todo.visibility === TodoVisibilityScope.Private
      ? todo.createdByComradeId === currentComradeId
        ? TodoDashboardMetaCopy.assignmentYours
        : `${TodoDashboardMetaCopy.creatorPrefix}${todo.creatorUsername}`
      : (todo.assigneeUsername ?? TodoDashboardMetaCopy.assignmentUnassigned);
  const dueSummary = todo.dueDate
    ? `${TodoDashboardMetaCopy.duePrefix}${todo.dueDate}`
    : TodoDashboardMetaCopy.noDueDate;
  return `${visibilityLabel} · ${assignmentSummary} · ${dueSummary}`;
}

export function buildCreateTodoRequestBody(input: {
  title: string;
  visibility: TodoVisibilityScope;
  assigneeComradeId: string;
}): CreateTodoBody {
  const trimmedTitle = input.title.trim();
  if (input.visibility === TodoVisibilityScope.Private) {
    return { title: trimmedTitle, visibility: TodoVisibilityScope.Private };
  }
  if (input.visibility === TodoVisibilityScope.Hub) {
    return {
      title: trimmedTitle,
      visibility: TodoVisibilityScope.Hub,
      assignedComradeId: input.assigneeComradeId === '' ? null : input.assigneeComradeId,
    };
  }
  return {
    title: trimmedTitle,
    visibility: TodoVisibilityScope.Assigned,
    assignedComradeId: input.assigneeComradeId,
  };
}
