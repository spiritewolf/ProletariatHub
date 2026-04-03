import { Box, Button, Text } from '@chakra-ui/react';
import type { ChoreListItem } from '@proletariat-hub/contracts';

import { formatChoreRowMetaLine } from '../../../features/dashboard/choreDisplay';
import { DashboardCopy } from '../../../features/dashboard/dashboardCopy';
import { DASHBOARD_ANNOYING_MODE_HINT_COLOR } from '../../../features/dashboard/dashboardUiTokens';
import { dashboardTheme } from '../../../styles/dashboardTheme';
import { DashboardListRow } from '../../ui/DashboardListRow';

type ChoreItemProps = {
  chore: ChoreListItem;
  isCompleting: boolean;
  disableComplete: boolean;
  onComplete: (choreId: string) => Promise<void>;
};

export function ChoreItem({
  chore,
  isCompleting,
  disableComplete,
  onComplete,
}: ChoreItemProps): React.ReactElement {
  return (
    <DashboardListRow
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
            loading={isCompleting}
            disabled={disableComplete}
            onClick={() => {
              void onComplete(chore.id);
            }}
          >
            {DashboardCopy.doneButton}
          </Button>
        </>
      }
    />
  );
}
