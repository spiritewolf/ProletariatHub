import type { DashboardComradeRow, DashboardReminderRow } from '@proletariat-hub/contracts';

export type RemindersWidgetProps = {
  reminders: DashboardReminderRow[] | undefined;
  comrades: DashboardComradeRow[];
  onRefresh: () => Promise<void>;
};
