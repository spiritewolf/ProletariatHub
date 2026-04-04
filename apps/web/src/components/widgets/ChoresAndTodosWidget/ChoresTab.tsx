import { Box, Flex } from '@chakra-ui/react';
import type { ChoreListItem, DashboardComradeRow } from '@proletariat-hub/contracts';

import { DashboardChoreQuickAddForm } from '../../../features/chores/DashboardChoreQuickAddForm';
import type { CreateChoreInput } from '../../../features/chores/useChoreMutations';
import { DashboardCopy } from '../../../features/dashboard/dashboardCopy';
import { dashboardTheme } from '../../../styles/dashboardTheme';
import { MutedCaption } from '../../ui/MutedCaption';
import { ChoreItem } from './ChoreItem';

type ChoresTabProps = {
  chores: ChoreListItem[];
  comrades: DashboardComradeRow[];
  isAdding: boolean;
  completingChoreId: string | null;
  onAddChore: (input: CreateChoreInput) => Promise<void>;
  onCompleteChore: (choreId: string) => Promise<void>;
};

export function ChoresTab({
  chores,
  comrades,
  isAdding,
  completingChoreId,
  onAddChore,
  onCompleteChore,
}: ChoresTabProps): React.ReactElement {
  return (
    <Flex direction="column" gap={2}>
      <DashboardChoreQuickAddForm comrades={comrades} isAdding={isAdding} onSubmit={onAddChore} />
      <Box>
        {chores.length === 0 ? (
          <MutedCaption text={DashboardCopy.choresEmpty} mutedColor={dashboardTheme.meta} />
        ) : (
          chores.map((chore) => (
            <ChoreItem
              key={chore.id}
              chore={chore}
              isCompleting={completingChoreId === chore.id}
              disableComplete={completingChoreId !== null}
              onComplete={onCompleteChore}
            />
          ))
        )}
      </Box>
    </Flex>
  );
}
