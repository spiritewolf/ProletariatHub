import { Button, Text } from '@chakra-ui/react';
import type { DashboardReminderRow } from '@proletariat-hub/contracts';

import { DashboardCopy } from '../../../features/dashboard/dashboardCopy';
import { formatReminderRowMetaLine } from '../../../features/dashboard/reminderDisplay';
import { dashboardTheme } from '../../../styles/dashboardTheme';
import { DashboardListRow } from '../../ui/DashboardListRow';

type ReminderItemProps = {
  reminder: DashboardReminderRow;
  isCompleting: boolean;
  disableComplete: boolean;
  onComplete: (reminderId: string) => Promise<void>;
};

export function ReminderItem({
  reminder,
  isCompleting,
  disableComplete,
  onComplete,
}: ReminderItemProps): React.ReactElement {
  return (
    <DashboardListRow
      leading={
        <Text fontSize="10px" lineHeight="1" aria-hidden>
          ◆
        </Text>
      }
      title={reminder.title}
      meta={formatReminderRowMetaLine(reminder)}
      trailing={
        <Button
          type="button"
          size="xs"
          fontSize="8px"
          h="20px"
          px={1.5}
          variant="outline"
          borderColor={dashboardTheme.cardBorder}
          loading={isCompleting}
          disabled={disableComplete}
          onClick={() => {
            void onComplete(reminder.id);
          }}
        >
          {DashboardCopy.doneButton}
        </Button>
      }
    />
  );
}
