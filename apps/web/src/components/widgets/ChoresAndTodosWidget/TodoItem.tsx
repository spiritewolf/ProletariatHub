import { Box, Button, Text } from '@chakra-ui/react';
import type { TodoListItem } from '@proletariat-hub/contracts';

import { DashboardCopy } from '../../../features/dashboard/dashboardCopy';
import { DASHBOARD_ANNOYING_MODE_HINT_COLOR } from '../../../features/dashboard/dashboardUiTokens';
import { formatDashboardTodoMetaLine } from '../../../features/dashboard/todoDisplay';
import { dashboardTheme } from '../../../styles/dashboardTheme';
import { DashboardListRow } from '../../ui/DashboardListRow';

type TodoItemProps = {
  todo: TodoListItem;
  currentComradeId: string;
  isCompleting: boolean;
  disableComplete: boolean;
  onComplete: (todoId: string) => Promise<void>;
};

export function TodoItem({
  todo,
  currentComradeId,
  isCompleting,
  disableComplete,
  onComplete,
}: TodoItemProps): React.ReactElement {
  return (
    <DashboardListRow
      leading={
        <Box
          borderRadius="sm"
          borderWidth="1px"
          borderColor={dashboardTheme.cardBorder}
          w="12px"
          h="12px"
        />
      }
      title={todo.title}
      meta={formatDashboardTodoMetaLine(todo, currentComradeId)}
      trailing={
        <>
          {todo.annoyingModeEnabled ? (
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
              void onComplete(todo.id);
            }}
          >
            {DashboardCopy.doneButton}
          </Button>
        </>
      }
    />
  );
}
