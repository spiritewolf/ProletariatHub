import { Box, Flex } from '@chakra-ui/react';
import type { DashboardComradeRow, TodoListItem } from '@proletariat-hub/contracts';

import { DashboardCopy } from '../../../features/dashboard/dashboardCopy';
import { DashboardTodoQuickAddForm } from '../../../features/todos/DashboardTodoQuickAddForm';
import { useTodoMutations } from '../../../features/todos/useTodoMutations';
import { dashboardTheme } from '../../../styles/dashboardTheme';
import { MutedCaption } from '../../ui/MutedCaption';
import { TodoItem } from './TodoItem';

type TodosTabProps = {
  todos: TodoListItem[];
  comrades: DashboardComradeRow[];
  currentComradeId: string;
  onRefresh: () => Promise<void>;
};

export function TodosTab({
  todos,
  comrades,
  currentComradeId,
  onRefresh,
}: TodosTabProps): React.ReactElement {
  const { isAdding, completingTodoId, addTodo, completeTodo } = useTodoMutations({ onRefresh });

  return (
    <Flex direction="column" gap={2}>
      <DashboardTodoQuickAddForm comrades={comrades} isAdding={isAdding} onSubmit={addTodo} />
      <Box>
        {todos.length === 0 ? (
          <MutedCaption text={DashboardCopy.todosEmpty} mutedColor={dashboardTheme.meta} />
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              currentComradeId={currentComradeId}
              isCompleting={completingTodoId === todo.id}
              disableComplete={completingTodoId !== null}
              onComplete={completeTodo}
            />
          ))
        )}
      </Box>
    </Flex>
  );
}
