import type { DashboardReminderRow } from '@proletariat-hub/contracts';

const REMINDER_CATEGORY_LABEL: Record<DashboardReminderRow['category'], string> = {
  birthday: 'Birthday',
  medical: 'Medical',
  dental: 'Dental',
  appointment: 'Appointment',
  annual_exam: 'Annual exam',
  general_reminder: 'General',
};

export const REMINDER_CATEGORY_SELECT_OPTIONS: Array<{
  value: DashboardReminderRow['category'];
  label: string;
}> = [
  { value: 'birthday', label: REMINDER_CATEGORY_LABEL.birthday },
  { value: 'medical', label: REMINDER_CATEGORY_LABEL.medical },
  { value: 'dental', label: REMINDER_CATEGORY_LABEL.dental },
  { value: 'appointment', label: REMINDER_CATEGORY_LABEL.appointment },
  { value: 'annual_exam', label: REMINDER_CATEGORY_LABEL.annual_exam },
  { value: 'general_reminder', label: REMINDER_CATEGORY_LABEL.general_reminder },
];

function parseLocalIsoDate(isoDate: string): Date {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatReminderRowMetaLine(reminder: DashboardReminderRow): string {
  const dateStr = parseLocalIsoDate(reminder.eventDate).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const cat = REMINDER_CATEGORY_LABEL[reminder.category];
  const timeSeg =
    reminder.eventTime != null && reminder.eventTime.length > 0 ? ` · ${reminder.eventTime}` : '';
  return `${dateStr}${timeSeg} · ${cat}`;
}
