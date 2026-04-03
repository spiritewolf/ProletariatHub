import { Box, Button, Flex, Input, NativeSelect, Text } from '@chakra-ui/react';
import type { DashboardComradeRow, DashboardReminderRow } from '@proletariat-hub/contracts';
import { useState } from 'react';

import { dashboardTheme } from '../../styles/dashboardTheme';
import { REMINDER_CATEGORY_SELECT_OPTIONS } from '../calendar/reminderDisplay';
import { DashboardCopy } from '../dashboard/dashboardCopy';
import type { CreateReminderInput } from './useReminderMutations';

type DashboardReminderQuickAddFormProps = {
  comrades: DashboardComradeRow[];
  isAdding: boolean;
  onSubmit: (input: CreateReminderInput) => Promise<void>;
};

export function DashboardReminderQuickAddForm({
  comrades,
  isAdding,
  onSubmit,
}: DashboardReminderQuickAddFormProps): React.ReactElement {
  const todayIsoDate = (() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  })();

  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState(todayIsoDate);
  const [eventTime, setEventTime] = useState('');
  const [category, setCategory] = useState<DashboardReminderRow['category']>('general_reminder');
  const [assigneeComradeId, setAssigneeComradeId] = useState('');

  const canSubmitAdd =
    title.trim().length > 0 &&
    eventDate.length > 0 &&
    /^(\d{4})-(\d{2})-(\d{2})$/.test(eventDate) &&
    !isAdding;

  const getReminderCategoryValue = (value: string): DashboardReminderRow['category'] | null => {
    const match = REMINDER_CATEGORY_SELECT_OPTIONS.find((option) => option.value === value);
    return match?.value ?? null;
  };

  return (
    <Flex
      as="form"
      gap={1.5}
      align="flex-end"
      flexShrink={0}
      flexWrap="wrap"
      onSubmit={(event) => event.preventDefault()}
    >
      <Box flex="1" minW="72px">
        <Text fontSize="8px" color={dashboardTheme.meta} mb={0.5}>
          {DashboardCopy.titleFieldLabel}
        </Text>
        <Input
          size="xs"
          fontSize="10px"
          h="26px"
          value={title}
          placeholder={DashboardCopy.reminderTitlePlaceholder}
          onChange={(event) => setTitle(event.target.value)}
          borderColor={dashboardTheme.cardBorder}
        />
      </Box>
      <Box minW="88px">
        <Text fontSize="8px" color={dashboardTheme.meta} mb={0.5}>
          {DashboardCopy.remindersDateLabel}
        </Text>
        <Input
          type="date"
          size="xs"
          fontSize="10px"
          h="26px"
          value={eventDate}
          onChange={(event) => setEventDate(event.target.value)}
          borderColor={dashboardTheme.cardBorder}
        />
      </Box>
      <Box minW="96px">
        <Text fontSize="8px" color={dashboardTheme.meta} mb={0.5}>
          {DashboardCopy.remindersCategoryLabel}
        </Text>
        <NativeSelect.Root size="xs">
          <NativeSelect.Field
            h="26px"
            fontSize="10px"
            value={category}
            onChange={(event) => {
              const nextCategory = getReminderCategoryValue(event.target.value);
              if (nextCategory !== null) {
                setCategory(nextCategory);
              }
            }}
            borderColor={dashboardTheme.cardBorder}
          >
            {REMINDER_CATEGORY_SELECT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </NativeSelect.Field>
        </NativeSelect.Root>
      </Box>
      <Box minW="72px">
        <Text fontSize="8px" color={dashboardTheme.meta} mb={0.5}>
          {DashboardCopy.remindersTimeLabel}
        </Text>
        <Input
          type="time"
          size="xs"
          fontSize="10px"
          h="26px"
          value={eventTime}
          onChange={(event) => setEventTime(event.target.value)}
          borderColor={dashboardTheme.cardBorder}
        />
      </Box>
      {comrades.length > 0 ? (
        <Box minW="88px">
          <Text fontSize="8px" color={dashboardTheme.meta} mb={0.5}>
            {DashboardCopy.remindersAssignLabel}
          </Text>
          <NativeSelect.Root size="xs">
            <NativeSelect.Field
              h="26px"
              fontSize="10px"
              value={assigneeComradeId}
              onChange={(event) => setAssigneeComradeId(event.target.value)}
              borderColor={dashboardTheme.cardBorder}
            >
              <option value="">{DashboardCopy.remindersAssignEveryone}</option>
              {comrades.map((comrade) => (
                <option key={comrade.id} value={comrade.id}>
                  {comrade.username}
                </option>
              ))}
            </NativeSelect.Field>
          </NativeSelect.Root>
        </Box>
      ) : null}
      <Button
        type="button"
        size="xs"
        fontSize="9px"
        h="26px"
        bg={dashboardTheme.title}
        color="white"
        disabled={!canSubmitAdd}
        onClick={() => {
          void (async () => {
            await onSubmit({
              title,
              category,
              eventDate,
              eventTime,
              assigneeComradeId,
            });
            setTitle('');
            setEventTime('');
            setAssigneeComradeId('');
          })();
        }}
      >
        {DashboardCopy.addButton}
      </Button>
    </Flex>
  );
}
