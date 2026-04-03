import { Box, Button, Flex, Input, NativeSelect, Text } from '@chakra-ui/react';
import {
  completeTodoResponseSchema,
  createTodoResponseSchema,
  type DashboardComradeRow,
  type TodoListItem,
  todoVisibilitySchema,
} from '@proletariat-hub/contracts';
import { useEffect, useState } from 'react';

import { apiJsonValidated } from '../../../../api';
import { MutedCaption } from '../../../../components/shared/MutedCaption';
import { DashboardListRow } from '../../../components/DashboardListRow';
import { dashboardTheme } from '../../../dashboardTheme';
import {
  DashboardApiResource,
  dashboardApiTodoCompletePath,
} from '../../../utils/dashboardApiPaths';
import { DashboardCopy } from '../../../utils/dashboardCopy';
import { DASHBOARD_ANNOYING_MODE_HINT_COLOR } from '../../../utils/dashboardUiTokens';
import {
  buildCreateTodoRequestBody,
  formatDashboardTodoMetaLine,
  TODO_VISIBILITY_FORM_OPTIONS,
  TodoVisibilityScope,
} from '../../../utils/todoDisplay';

type DashboardTodosTabProps = {
  todos: TodoListItem[];
  comrades: DashboardComradeRow[];
  currentComradeId: string;
  onRefresh: () => Promise<void>;
};

export function DashboardTodosTab({
  todos,
  comrades,
  currentComradeId,
  onRefresh,
}: DashboardTodosTabProps) {
  const [title, setTitle] = useState('');
  const [visibilityScope, setVisibilityScope] = useState<TodoVisibilityScope>(
    TodoVisibilityScope.Hub,
  );
  const [assigneeComradeId, setAssigneeComradeId] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [completingTodoId, setCompletingTodoId] = useState<string | null>(null);

  useEffect(() => {
    if (comrades.length === 0) {
      return;
    }
    if (visibilityScope === TodoVisibilityScope.Hub) {
      setAssigneeComradeId('');
    } else if (visibilityScope === TodoVisibilityScope.Assigned) {
      setAssigneeComradeId((previous) => (previous === '' ? comrades[0].id : previous));
    }
  }, [visibilityScope, comrades]);

  const canSubmitAdd =
    title.trim().length > 0 &&
    !isAdding &&
    (visibilityScope !== TodoVisibilityScope.Assigned || assigneeComradeId.length > 0);

  const getVisibilityScopeValue = (value: string): TodoVisibilityScope | null => {
    const parsed = todoVisibilitySchema.safeParse(value);
    if (!parsed.success) {
      return null;
    }
    switch (parsed.data) {
      case 'hub':
        return TodoVisibilityScope.Hub;
      case 'assigned':
        return TodoVisibilityScope.Assigned;
      case 'private':
        return TodoVisibilityScope.Private;
    }
  };

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
            placeholder={DashboardCopy.todoTitlePlaceholder}
            onChange={(event) => setTitle(event.target.value)}
            borderColor={dashboardTheme.cardBorder}
          />
        </Box>
        <Box minW="72px">
          <Text fontSize="8px" color={dashboardTheme.meta} mb={0.5}>
            {DashboardCopy.scopeFieldLabel}
          </Text>
          <NativeSelect.Root size="xs">
            <NativeSelect.Field
              h="26px"
              fontSize="10px"
              value={visibilityScope}
              onChange={(event) => {
                const nextScope = getVisibilityScopeValue(event.target.value);
                if (nextScope !== null) {
                  setVisibilityScope(nextScope);
                }
              }}
              borderColor={dashboardTheme.cardBorder}
            >
              {TODO_VISIBILITY_FORM_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </NativeSelect.Field>
          </NativeSelect.Root>
        </Box>
        {visibilityScope !== TodoVisibilityScope.Private ? (
          <Box minW="88px">
            <Text fontSize="8px" color={dashboardTheme.meta} mb={0.5}>
              {visibilityScope === TodoVisibilityScope.Hub
                ? DashboardCopy.assignOptionalFieldLabel
                : DashboardCopy.assignFieldLabel}
            </Text>
            <NativeSelect.Root size="xs">
              <NativeSelect.Field
                h="26px"
                fontSize="10px"
                value={assigneeComradeId}
                onChange={(event) => setAssigneeComradeId(event.target.value)}
                borderColor={dashboardTheme.cardBorder}
              >
                {visibilityScope === TodoVisibilityScope.Hub ? (
                  <option value="">{DashboardCopy.assigneeSelectNone}</option>
                ) : null}
                {comrades.map((comrade) => (
                  <option key={comrade.id} value={comrade.id}>
                    {comrade.username}
                  </option>
                ))}
              </NativeSelect.Field>
            </NativeSelect.Root>
          </Box>
        ) : null}
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
                const requestBody = buildCreateTodoRequestBody({
                  title,
                  visibility: visibilityScope,
                  assigneeComradeId,
                });
                await apiJsonValidated(DashboardApiResource.Todos, createTodoResponseSchema, {
                  method: 'POST',
                  json: requestBody,
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
        {todos.length === 0 ? (
          <MutedCaption text={DashboardCopy.todosEmpty} mutedColor={dashboardTheme.meta} />
        ) : (
          todos.map((todo) => (
            <DashboardListRow
              key={todo.id}
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
                    loading={completingTodoId === todo.id}
                    disabled={completingTodoId !== null}
                    onClick={() => {
                      void (async () => {
                        setCompletingTodoId(todo.id);
                        try {
                          await apiJsonValidated(
                            dashboardApiTodoCompletePath(todo.id),
                            completeTodoResponseSchema,
                            { method: 'POST', json: {} },
                          );
                          await onRefresh();
                        } finally {
                          setCompletingTodoId(null);
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
