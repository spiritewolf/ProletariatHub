export enum DashboardApiResource {
  Summary = '/api/dashboard/summary',
  Chores = '/api/chores',
  Todos = '/api/todos',
  Reminders = '/api/reminders',
}

export function dashboardApiChoreCompletePath(choreId: string): string {
  return `${DashboardApiResource.Chores}/${choreId}/complete`;
}

export function dashboardApiTodoCompletePath(todoId: string): string {
  return `${DashboardApiResource.Todos}/${todoId}/complete`;
}

export function dashboardApiReminderCompletePath(reminderId: string): string {
  return `${DashboardApiResource.Reminders}/${reminderId}/complete`;
}
