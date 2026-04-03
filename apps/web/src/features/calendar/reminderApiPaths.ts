export const REMINDER_API_PATH = '/api/reminders';

export function reminderCompletePath(reminderId: string): string {
  return `${REMINDER_API_PATH}/${reminderId}/complete`;
}
