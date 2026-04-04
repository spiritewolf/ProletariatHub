import { Box, Flex } from '@chakra-ui/react';
import type { DashboardComradeRow, TodoListItem } from '@proletariat-hub/contracts';

import { DashboardCopy } from '../../../features/dashboard/dashboardCopy';
import { DashboardTodoQuickAddForm } from '../../../features/todos/DashboardTodoQuickAddForm';
import type { CreateTodoInput } from '../../../features/todos/useTodoMutations';
import { dashboardTheme } from '../../../styles/dashboardTheme';
import { MutedCaption } from '../../ui/MutedCaption';
import { TodoItem } from './TodoItem';

type TodosTabProps = {
  todos: TodoListItem[];
  comrades: DashboardComradeRow[];
  currentComradeId: string;
  isAdding: boolean;
  completingTodoId: string | null;
  onAddTodo: (input: CreateTodoInput) => Promise<void>;
  onCompleteTodo: (todoId: string) => Promise<void>;
};

export function TodosTab({
  todos,
  comrades,
  currentComradeId,
  isAdding,
  completingTodoId,
  onAddTodo,
  onCompleteTodo,
}: TodosTabProps): React.ReactElement {
  return (
    <Flex direction="column" gap={2}>
      <DashboardTodoQuickAddForm comrades={comrades} isAdding={isAdding} onSubmit={onAddTodo} />
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
              onComplete={onCompleteTodo}
            />
          ))
        )}
      </Box>
    </Flex>
  );
}
