import { Box } from '@chakra-ui/react';
import { useState } from 'react';

import { DashboardCopy } from '../../../features/dashboard/dashboardCopy';
import { DashboardWorkTab } from '../../../features/dashboard/dashboardWorkTab';
import { dashboardTheme } from '../../../styles/dashboardTheme';
import { DashboardWidget } from '../../ui/DashboardWidget';
import { MutedCaption } from '../../ui/MutedCaption';
import type { ChoresAndTodosWidgetProps } from './ChoresAndTodosWidget.types';
import { ChoresTab } from './ChoresTab';
import { TodosTab } from './TodosTab';
import { WorkTabButtons } from './WorkTabButtons';

export function ChoresAndTodosWidget({
  chores,
  todos,
  comrades,
  authenticatedComrade,
  isAddingChore,
  completingChoreId,
  onAddChore,
  onCompleteChore,
  isAddingTodo,
  completingTodoId,
  onAddTodo,
  onCompleteTodo,
}: ChoresAndTodosWidgetProps): React.ReactElement {
  const [workTab, setWorkTab] = useState(DashboardWorkTab.Chores);

  return (
    <DashboardWidget
      title={DashboardCopy.choresTodosWidgetTitle}
      action={
        <Box as="span" fontSize="9px">
          {DashboardCopy.choresTodosAdd}
        </Box>
      }
      flex="1"
    >
      <WorkTabButtons activeTab={workTab} onTabChange={setWorkTab} />
      {workTab === DashboardWorkTab.Chores ? (
        chores !== undefined ? (
          <ChoresTab
            chores={chores}
            comrades={comrades}
            isAdding={isAddingChore}
            completingChoreId={completingChoreId}
            onAddChore={onAddChore}
            onCompleteChore={onCompleteChore}
          />
        ) : (
          <MutedCaption text={DashboardCopy.loading} mutedColor={dashboardTheme.meta} />
        )
      ) : todos !== undefined ? (
        <TodosTab
          todos={todos}
          comrades={comrades}
          currentComradeId={authenticatedComrade.id}
          isAdding={isAddingTodo}
          completingTodoId={completingTodoId}
          onAddTodo={onAddTodo}
          onCompleteTodo={onCompleteTodo}
        />
      ) : (
        <MutedCaption text={DashboardCopy.loading} mutedColor={dashboardTheme.meta} />
      )}
    </DashboardWidget>
  );
}
