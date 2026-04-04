import type {
  AuthenticatedComrade,
  ChoreListItem,
  DashboardComradeRow,
  TodoListItem,
} from '@proletariat-hub/contracts';

import type { CreateChoreInput } from '../../../features/chores/useChoreMutations';
import type { CreateTodoInput } from '../../../features/todos/useTodoMutations';

export type ChoresAndTodosWidgetProps = {
  chores: ChoreListItem[] | undefined;
  todos: TodoListItem[] | undefined;
  comrades: DashboardComradeRow[];
  authenticatedComrade: AuthenticatedComrade;
  isAddingChore: boolean;
  completingChoreId: string | null;
  onAddChore: (input: CreateChoreInput) => Promise<void>;
  onCompleteChore: (choreId: string) => Promise<void>;
  isAddingTodo: boolean;
  completingTodoId: string | null;
  onAddTodo: (input: CreateTodoInput) => Promise<void>;
  onCompleteTodo: (todoId: string) => Promise<void>;
};
