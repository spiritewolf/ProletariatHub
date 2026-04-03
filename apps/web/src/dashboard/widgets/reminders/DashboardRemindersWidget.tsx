import { Box, Button, Flex, Input, NativeSelect, Text } from '@chakra-ui/react';
import {
  completeReminderResponseSchema,
  createReminderResponseSchema,
  type DashboardComradeRow,
  type DashboardReminderRow,
} from '@proletariat-hub/contracts';
import { useEffect, useState } from 'react';

import { apiJsonValidated } from '../../../api';
import { MutedCaption } from '../../../components/shared/MutedCaption';
import { DashboardListRow } from '../../components/DashboardListRow';
import { dashboardTheme } from '../../dashboardTheme';
import {
  dashboardApiReminderCompletePath,
  DashboardApiResource,
} from '../../utils/dashboardApiPaths';
import { DashboardCopy } from '../../utils/dashboardCopy';
import {
  formatReminderRowMetaLine,
  REMINDER_CATEGORY_SELECT_OPTIONS,
} from '../../utils/reminderDisplay';

type DashboardRemindersWidgetProps = {
  reminders: DashboardReminderRow[] | undefined;
  comrades: DashboardComradeRow[];
  onRefresh: () => Promise<void>;
};

export function DashboardRemindersWidget({
  reminders,
  comrades,
  onRefresh,
}: DashboardRemindersWidgetProps) {
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [category, setCategory] = useState<DashboardReminderRow['category']>('general_reminder');
  const [assigneeComradeId, setAssigneeComradeId] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);

  useEffect(() => {
    if (eventDate.length === 0) {
      const d = new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      setEventDate(`${y}-${m}-${day}`);
    }
  }, [eventDate.length]);

  const canSubmitAdd =
    title.trim().length > 0 &&
    eventDate.length > 0 &&
    /^(\d{4})-(\d{2})-(\d{2})$/.test(eventDate) &&
    !isAdding;

  const getReminderCategoryValue = (value: string): DashboardReminderRow['category'] | null => {
    const match = REMINDER_CATEGORY_SELECT_OPTIONS.find((option) => option.value === value);
    return match?.value ?? null;
  };

  if (reminders === undefined) {
    return <MutedCaption text={DashboardCopy.loading} mutedColor={dashboardTheme.meta} />;
  }

  return (
    <Flex direction="column" gap={2}>
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
              {REMINDER_CATEGORY_SELECT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
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
                {comrades.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.username}
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
              setIsAdding(true);
              try {
                const payload: Record<string, unknown> = {
                  title: title.trim(),
                  category,
                  eventDate,
                  assignedComradeIds: assigneeComradeId.length > 0 ? [assigneeComradeId] : [],
                };
                if (eventTime.trim().length > 0) {
                  payload.eventTime = eventTime.trim();
                }
                await apiJsonValidated(
                  DashboardApiResource.Reminders,
                  createReminderResponseSchema,
                  {
                    method: 'POST',
                    json: payload,
                  },
                );
                setTitle('');
                setEventTime('');
                setAssigneeComradeId('');
                await onRefresh();
              } finally {
                setIsAdding(false);
              }
            })();
          }}
        >
          {DashboardCopy.addButton}
        </Button>
      </Flex>
      <Box>
        {reminders.length === 0 ? (
          <MutedCaption text={DashboardCopy.remindersEmpty} mutedColor={dashboardTheme.meta} />
        ) : (
          reminders.map((reminder) => (
            <DashboardListRow
              key={reminder.id}
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
                  loading={completingId === reminder.id}
                  disabled={completingId !== null}
                  onClick={() => {
                    void (async () => {
                      setCompletingId(reminder.id);
                      try {
                        await apiJsonValidated(
                          dashboardApiReminderCompletePath(reminder.id),
                          completeReminderResponseSchema,
                          { method: 'POST', json: {} },
                        );
                        await onRefresh();
                      } finally {
                        setCompletingId(null);
                      }
                    })();
                  }}
                >
                  {DashboardCopy.doneButton}
                </Button>
              }
            />
          ))
        )}
      </Box>
    </Flex>
  );
}
