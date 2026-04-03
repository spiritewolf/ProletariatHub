import { Box, Button, Flex, Input, NativeSelect, Text } from '@chakra-ui/react';
import { type DashboardComradeRow, todoVisibilitySchema } from '@proletariat-hub/contracts';
import { useState } from 'react';

import { dashboardTheme } from '../../styles/dashboardTheme';
import { DashboardCopy } from '../dashboard/dashboardCopy';
import { TODO_VISIBILITY_FORM_OPTIONS, TodoVisibilityScope } from './todoDisplay';
import type { CreateTodoInput } from './useTodoMutations';

type DashboardTodoQuickAddFormProps = {
  comrades: DashboardComradeRow[];
  isAdding: boolean;
  onSubmit: (input: CreateTodoInput) => Promise<void>;
};

function getVisibilityScopeValue(value: string): TodoVisibilityScope | null {
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
}

export function DashboardTodoQuickAddForm({
  comrades,
  isAdding,
  onSubmit,
}: DashboardTodoQuickAddFormProps): React.ReactElement {
  const [title, setTitle] = useState('');
  const [visibilityScope, setVisibilityScope] = useState<TodoVisibilityScope>(
    TodoVisibilityScope.Hub,
  );
  const [assigneeComradeId, setAssigneeComradeId] = useState('');

  const fallbackComradeId = comrades[0]?.id ?? '';
  const effectiveAssigneeComradeId =
    visibilityScope === TodoVisibilityScope.Assigned
      ? assigneeComradeId || fallbackComradeId
      : assigneeComradeId;

  const canSubmitAdd =
    title.trim().length > 0 &&
    !isAdding &&
    (visibilityScope !== TodoVisibilityScope.Assigned || effectiveAssigneeComradeId.length > 0);

  return (
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
                if (nextScope === TodoVisibilityScope.Hub) {
                  setAssigneeComradeId('');
                }
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
              value={effectiveAssigneeComradeId}
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
            await onSubmit({
              title,
              visibility: visibilityScope,
              assigneeComradeId: effectiveAssigneeComradeId,
            });
            setTitle('');
          })();
        }}
      >
        {DashboardCopy.addButton}
      </Button>
    </Flex>
  );
}
