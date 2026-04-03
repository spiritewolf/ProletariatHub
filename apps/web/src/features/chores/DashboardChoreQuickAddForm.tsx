import { Box, Button, Flex, Input, NativeSelect, Text } from '@chakra-ui/react';
import type { ChoreListItem, DashboardComradeRow } from '@proletariat-hub/contracts';
import { useState } from 'react';

import { dashboardTheme } from '../../styles/dashboardTheme';
import { DashboardCopy } from '../dashboard/dashboardCopy';
import type { CreateChoreInput } from './useChoreMutations';

type DashboardChoreQuickAddFormProps = {
  comrades: DashboardComradeRow[];
  isAdding: boolean;
  onSubmit: (input: CreateChoreInput) => Promise<void>;
};

const CHORE_ASSIGN_ROTATE_OPTION_VALUE = '__rotate_hub__';

function parseChoreFrequency(value: string): ChoreListItem['frequency'] | null {
  switch (value) {
    case 'daily':
    case 'weekly':
    case 'monthly':
    case 'custom':
      return value;
    default:
      return null;
  }
}

export function DashboardChoreQuickAddForm({
  comrades,
  isAdding,
  onSubmit,
}: DashboardChoreQuickAddFormProps): React.ReactElement {
  const [title, setTitle] = useState('');
  const [assigneeComradeId, setAssigneeComradeId] = useState('');
  const [frequency, setFrequency] = useState<ChoreListItem['frequency']>('weekly');
  const [rotateAcrossHub, setRotateAcrossHub] = useState(false);
  const [annoyingModeEnabled, setAnnoyingModeEnabled] = useState(false);

  const fallbackComradeId = comrades[0]?.id ?? '';
  const effectiveAssigneeComradeId =
    assigneeComradeId.length > 0 ? assigneeComradeId : fallbackComradeId;

  const canSubmitAdd =
    title.trim().length > 0 && effectiveAssigneeComradeId.length > 0 && !isAdding;

  return (
    <Flex
      as="form"
      gap={1.5}
      align="flex-end"
      flexShrink={0}
      flexWrap="wrap"
      onSubmit={(event) => event.preventDefault()}
    >
      <Box flex="1" minW="100px">
        <Text fontSize="8px" color={dashboardTheme.meta} mb={0.5}>
          {DashboardCopy.titleFieldLabel}
        </Text>
        <Input
          size="xs"
          fontSize="10px"
          h="26px"
          value={title}
          placeholder={DashboardCopy.choreTitlePlaceholder}
          onChange={(event) => setTitle(event.target.value)}
          borderColor={dashboardTheme.cardBorder}
        />
      </Box>
      <Box minW="88px">
        <Text fontSize="8px" color={dashboardTheme.meta} mb={0.5}>
          {DashboardCopy.assignFieldLabel}
        </Text>
        <NativeSelect.Root size="xs">
          <NativeSelect.Field
            h="26px"
            fontSize="10px"
            value={rotateAcrossHub ? CHORE_ASSIGN_ROTATE_OPTION_VALUE : effectiveAssigneeComradeId}
            onChange={(event) => {
              const selected = event.target.value;
              if (selected === CHORE_ASSIGN_ROTATE_OPTION_VALUE) {
                setRotateAcrossHub(true);
                setAssigneeComradeId((previous) => previous || fallbackComradeId);
                return;
              }
              setRotateAcrossHub(false);
              setAssigneeComradeId(selected);
            }}
            borderColor={dashboardTheme.cardBorder}
          >
            {comrades.map((comrade) => (
              <option key={comrade.id} value={comrade.id}>
                {comrade.username}
              </option>
            ))}
            <option value={CHORE_ASSIGN_ROTATE_OPTION_VALUE}>
              {DashboardCopy.assignRotateOption}
            </option>
          </NativeSelect.Field>
        </NativeSelect.Root>
      </Box>
      <Box minW="88px">
        <Text fontSize="8px" color={dashboardTheme.meta} mb={0.5}>
          {DashboardCopy.frequencyFieldLabel}
        </Text>
        <NativeSelect.Root size="xs">
          <NativeSelect.Field
            h="26px"
            fontSize="10px"
            value={frequency}
            onChange={(event) => {
              const nextFrequency = parseChoreFrequency(event.target.value);
              if (nextFrequency !== null) {
                setFrequency(nextFrequency);
              }
            }}
            borderColor={dashboardTheme.cardBorder}
          >
            <option value="daily">{DashboardCopy.frequencyDailyOption}</option>
            <option value="weekly">{DashboardCopy.frequencyWeeklyOption}</option>
            <option value="monthly">{DashboardCopy.frequencyMonthlyOption}</option>
            <option value="custom">{DashboardCopy.frequencyCustomOption}</option>
          </NativeSelect.Field>
        </NativeSelect.Root>
      </Box>
      <Box minW="72px">
        <Text fontSize="8px" color={dashboardTheme.meta} mb={0.5}>
          {DashboardCopy.nudgeFieldLabel}
        </Text>
        <NativeSelect.Root size="xs">
          <NativeSelect.Field
            h="26px"
            fontSize="10px"
            value={annoyingModeEnabled ? 'on' : 'off'}
            onChange={(event) => setAnnoyingModeEnabled(event.target.value === 'on')}
            borderColor={dashboardTheme.cardBorder}
          >
            <option value="off">{DashboardCopy.nudgeOffOption}</option>
            <option value="on">{DashboardCopy.nudgeOnOption}</option>
          </NativeSelect.Field>
        </NativeSelect.Root>
      </Box>
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
              assignedComradeId: effectiveAssigneeComradeId,
              frequency,
              rotateAcrossHub,
              annoyingModeEnabled,
            });
            setTitle('');
          })();
        }}
      >
        {DashboardCopy.addButton}
      </Button>
    </Flex>
  );
}
