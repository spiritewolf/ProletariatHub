import type { DashboardComradeRow, DashboardReminderRow } from '@proletariat-hub/contracts';

import type { CreateReminderInput } from '../../../features/calendar/useReminderMutations';

export type RemindersWidgetProps = {
  reminders: DashboardReminderRow[] | undefined;
  comrades: DashboardComradeRow[];
  isAdding: boolean;
  completingId: string | null;
  onAddReminder: (input: CreateReminderInput) => Promise<void>;
  onCompleteReminder: (reminderId: string) => Promise<void>;
};
