import type {
  AuthenticatedComrade,
  ChoreListItem,
  DashboardComradeRow,
  TodoListItem,
} from '@proletariat-hub/contracts';

export type ChoresAndTodosWidgetProps = {
  chores: ChoreListItem[] | undefined;
  todos: TodoListItem[] | undefined;
  comrades: DashboardComradeRow[];
  authenticatedComrade: AuthenticatedComrade;
  onRefresh: () => Promise<void>;
};
