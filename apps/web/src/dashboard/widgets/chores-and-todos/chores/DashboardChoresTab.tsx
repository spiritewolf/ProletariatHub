import { Box, Button, Flex, Input, NativeSelect, Text } from '@chakra-ui/react';
import {
  type ChoreListItem,
  completeChoreResponseSchema,
  createChoreResponseSchema,
  type DashboardComradeRow,
} from '@proletariat-hub/contracts';
import { useEffect, useState } from 'react';

import { apiJsonValidated } from '../../../../api';
import { MutedCaption } from '../../../../components/shared/MutedCaption';
import { DashboardListRow } from '../../../components/DashboardListRow';
import { dashboardTheme } from '../../../dashboardTheme';
import { formatChoreRowMetaLine } from '../../../utils/choreDisplay';
import {
  dashboardApiChoreCompletePath,
  DashboardApiResource,
} from '../../../utils/dashboardApiPaths';
import { DashboardCopy } from '../../../utils/dashboardCopy';
import { DASHBOARD_ANNOYING_MODE_HINT_COLOR } from '../../../utils/dashboardUiTokens';

type DashboardChoresTabProps = {
  chores: ChoreListItem[];
  comrades: DashboardComradeRow[];
  onRefresh: () => Promise<void>;
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

export function DashboardChoresTab({ chores, comrades, onRefresh }: DashboardChoresTabProps) {
  const [title, setTitle] = useState('');
  const [assigneeComradeId, setAssigneeComradeId] = useState('');
  const [frequency, setFrequency] = useState<ChoreListItem['frequency']>('weekly');
  const [rotateAcrossHub, setRotateAcrossHub] = useState(false);
  const [annoyingModeEnabled, setAnnoyingModeEnabled] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [completingChoreId, setCompletingChoreId] = useState<string | null>(null);

  useEffect(() => {
    if (comrades.length === 0) {
      return;
    }
    setAssigneeComradeId((previous) => (previous === '' ? comrades[0].id : previous));
  }, [comrades]);

  const canSubmitAdd = title.trim().length > 0 && assigneeComradeId.length > 0 && !isAdding;

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
              value={rotateAcrossHub ? CHORE_ASSIGN_ROTATE_OPTION_VALUE : assigneeComradeId}
              onChange={(event) => {
                const selected = event.target.value;
                if (selected === CHORE_ASSIGN_ROTATE_OPTION_VALUE) {
                  setRotateAcrossHub(true);
                  setAssigneeComradeId((previous) => previous || comrades[0]?.id || '');
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
              setIsAdding(true);
              try {
                await apiJsonValidated(DashboardApiResource.Chores, createChoreResponseSchema, {
                  method: 'POST',
                  json: {
                    title: title.trim(),
                    assignedComradeId: assigneeComradeId,
                    frequency,
                    rotateAcrossHub,
                    annoyingModeEnabled,
                  },
                });
                setTitle('');
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
        {chores.length === 0 ? (
          <MutedCaption text={DashboardCopy.choresEmpty} mutedColor={dashboardTheme.meta} />
        ) : (
          chores.map((chore) => (
            <DashboardListRow
              key={chore.id}
              leading={
                <Box
                  borderRadius="full"
                  borderWidth="1px"
                  borderColor={dashboardTheme.cardBorder}
                  w="12px"
                  h="12px"
                />
              }
              title={chore.title}
              meta={formatChoreRowMetaLine(chore)}
              trailing={
                <>
                  {chore.annoyingModeEnabled ? (
                    <Text
                      as="span"
                      fontSize="8px"
                      color={DASHBOARD_ANNOYING_MODE_HINT_COLOR}
                      whiteSpace="nowrap"
                    >
                      {DashboardCopy.nudgeHint}
                    </Text>
                  ) : null}
                  <Button
                    type="button"
                    size="xs"
                    fontSize="8px"
                    h="20px"
                    px={1.5}
                    variant="outline"
                    borderColor={dashboardTheme.cardBorder}
                    loading={completingChoreId === chore.id}
                    disabled={completingChoreId !== null}
                    onClick={() => {
                      void (async () => {
                        setCompletingChoreId(chore.id);
                        try {
                          await apiJsonValidated(
                            dashboardApiChoreCompletePath(chore.id),
                            completeChoreResponseSchema,
                            { method: 'POST', json: {} },
                          );
                          await onRefresh();
                        } finally {
                          setCompletingChoreId(null);
                        }
                      })();
                    }}
                  >
                    {DashboardCopy.doneButton}
                  </Button>
                </>
              }
            />
          ))
        )}
      </Box>
    </Flex>
  );
}
