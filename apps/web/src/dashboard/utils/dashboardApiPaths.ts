export enum DashboardApiResource {
  Summary = '/api/dashboard/summary',
  Chores = '/api/chores',
  Todos = '/api/todos',
}

export function dashboardApiChoreCompletePath(choreId: string): string {
  return `${DashboardApiResource.Chores}/${choreId}/complete`;
}

export function dashboardApiTodoCompletePath(todoId: string): string {
  return `${DashboardApiResource.Todos}/${todoId}/complete`;
}
