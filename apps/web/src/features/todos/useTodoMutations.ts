import { completeTodoResponseSchema, createTodoResponseSchema } from '@proletariat-hub/contracts';
import { useState } from 'react';

import { apiJsonValidated } from '../../lib/api';
import { TODO_API_PATH, todoCompletePath } from './todoApiPaths';
import { buildCreateTodoRequestBody, type TodoVisibilityScope } from './todoDisplay';

export type CreateTodoInput = {
  title: string;
  visibility: TodoVisibilityScope;
  assigneeComradeId: string;
};

type UseTodoMutationsArgs = {
  onRefresh: () => Promise<void>;
};

type UseTodoMutationsResult = {
  isAdding: boolean;
  completingTodoId: string | null;
  addTodo: (input: CreateTodoInput) => Promise<void>;
  completeTodo: (todoId: string) => Promise<void>;
};

export function useTodoMutations({ onRefresh }: UseTodoMutationsArgs): UseTodoMutationsResult {
  const [isAdding, setIsAdding] = useState(false);
  const [completingTodoId, setCompletingTodoId] = useState<string | null>(null);

  async function addTodo(input: CreateTodoInput): Promise<void> {
    setIsAdding(true);
    try {
      const requestBody = buildCreateTodoRequestBody({
        title: input.title,
        visibility: input.visibility,
        assigneeComradeId: input.assigneeComradeId,
      });
      await apiJsonValidated(TODO_API_PATH, createTodoResponseSchema, {
        method: 'POST',
        json: requestBody,
      });
      await onRefresh();
    } finally {
      setIsAdding(false);
    }
  }

  async function completeTodo(todoId: string): Promise<void> {
    setCompletingTodoId(todoId);
    try {
      await apiJsonValidated(todoCompletePath(todoId), completeTodoResponseSchema, {
        method: 'POST',
        json: {},
      });
      await onRefresh();
    } finally {
      setCompletingTodoId(null);
    }
  }

  return { isAdding, completingTodoId, addTodo, completeTodo };
}
