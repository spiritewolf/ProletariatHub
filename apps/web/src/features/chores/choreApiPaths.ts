export const CHORE_API_PATH = '/api/chores';

export function choreCompletePath(choreId: string): string {
  return `${CHORE_API_PATH}/${choreId}/complete`;
}
