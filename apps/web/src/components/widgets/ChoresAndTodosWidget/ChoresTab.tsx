import { Box, Flex } from '@chakra-ui/react';
import type { ChoreListItem, DashboardComradeRow } from '@proletariat-hub/contracts';

import { DashboardChoreQuickAddForm } from '../../../features/chores/DashboardChoreQuickAddForm';
import { useChoreMutations } from '../../../features/chores/useChoreMutations';
import { DashboardCopy } from '../../../features/dashboard/dashboardCopy';
import { dashboardTheme } from '../../../styles/dashboardTheme';
import { MutedCaption } from '../../ui/MutedCaption';
import { ChoreItem } from './ChoreItem';

type ChoresTabProps = {
  chores: ChoreListItem[];
  comrades: DashboardComradeRow[];
  onRefresh: () => Promise<void>;
};

export function ChoresTab({ chores, comrades, onRefresh }: ChoresTabProps): React.ReactElement {
  const { isAdding, completingChoreId, addChore, completeChore } = useChoreMutations({ onRefresh });

  return (
    <Flex direction="column" gap={2}>
      <DashboardChoreQuickAddForm comrades={comrades} isAdding={isAdding} onSubmit={addChore} />
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
              onComplete={completeChore}
            />
          ))
        )}
      </Box>
    </Flex>
  );
}
