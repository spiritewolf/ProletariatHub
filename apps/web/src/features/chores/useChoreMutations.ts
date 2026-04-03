import {
  type ChoreListItem,
  completeChoreResponseSchema,
  createChoreResponseSchema,
} from '@proletariat-hub/contracts';
import { useState } from 'react';

import { apiJsonValidated } from '../../lib/api';
import { CHORE_API_PATH, choreCompletePath } from './choreApiPaths';

export type CreateChoreInput = {
  title: string;
  assignedComradeId: string;
  frequency: ChoreListItem['frequency'];
  rotateAcrossHub: boolean;
  annoyingModeEnabled: boolean;
};

type UseChoreMutationsArgs = {
  onRefresh: () => Promise<void>;
};

type UseChoreMutationsResult = {
  isAdding: boolean;
  completingChoreId: string | null;
  addChore: (input: CreateChoreInput) => Promise<void>;
  completeChore: (choreId: string) => Promise<void>;
};

export function useChoreMutations({ onRefresh }: UseChoreMutationsArgs): UseChoreMutationsResult {
  const [isAdding, setIsAdding] = useState(false);
  const [completingChoreId, setCompletingChoreId] = useState<string | null>(null);

  async function addChore(input: CreateChoreInput): Promise<void> {
    setIsAdding(true);
    try {
      await apiJsonValidated(CHORE_API_PATH, createChoreResponseSchema, {
        method: 'POST',
        json: {
          title: input.title.trim(),
          assignedComradeId: input.assignedComradeId,
          frequency: input.frequency,
          rotateAcrossHub: input.rotateAcrossHub,
          annoyingModeEnabled: input.annoyingModeEnabled,
        },
      });
      await onRefresh();
    } finally {
      setIsAdding(false);
    }
  }

  async function completeChore(choreId: string): Promise<void> {
    setCompletingChoreId(choreId);
    try {
      await apiJsonValidated(choreCompletePath(choreId), completeChoreResponseSchema, {
        method: 'POST',
        json: {},
      });
      await onRefresh();
    } finally {
      setCompletingChoreId(null);
    }
  }

  return { isAdding, completingChoreId, addChore, completeChore };
}
