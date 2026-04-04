import { Box, Flex } from '@chakra-ui/react';

import { DashboardReminderQuickAddForm } from '../../../features/calendar/DashboardReminderQuickAddForm';
import { DashboardCopy } from '../../../features/dashboard/dashboardCopy';
import { dashboardTheme } from '../../../styles/dashboardTheme';
import { MutedCaption } from '../../ui/MutedCaption';
import { ReminderItem } from './ReminderItem';
import type { RemindersWidgetProps } from './RemindersWidget.types';

export function RemindersWidget({
  reminders,
  comrades,
  isAdding,
  completingId,
  onAddReminder,
  onCompleteReminder,
}: RemindersWidgetProps): React.ReactElement {
  if (reminders === undefined) {
    return <MutedCaption text={DashboardCopy.loading} mutedColor={dashboardTheme.meta} />;
  }

  return (
    <Flex direction="column" gap={2}>
      <DashboardReminderQuickAddForm
        comrades={comrades}
        isAdding={isAdding}
        onSubmit={onAddReminder}
      />
      <Box>
        {reminders.length === 0 ? (
          <MutedCaption text={DashboardCopy.remindersEmpty} mutedColor={dashboardTheme.meta} />
        ) : (
          reminders.map((reminder) => (
            <ReminderItem
              key={reminder.id}
              reminder={reminder}
              isCompleting={completingId === reminder.id}
              disableComplete={completingId !== null}
              onComplete={onCompleteReminder}
            />
          ))
        )}
      </Box>
    </Flex>
  );
}
