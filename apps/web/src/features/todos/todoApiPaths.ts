export const TODO_API_PATH = '/api/todos';

export function todoCompletePath(todoId: string): string {
  return `${TODO_API_PATH}/${todoId}/complete`;
}
