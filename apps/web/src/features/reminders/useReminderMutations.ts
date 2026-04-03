import {
  completeReminderResponseSchema,
  createReminderResponseSchema,
} from '@proletariat-hub/contracts';
import { useState } from 'react';

import { apiJsonValidated } from '../../lib/api';
import {
  dashboardApiReminderCompletePath,
  DashboardApiResource,
} from '../dashboard/dashboardApiPaths';

export type CreateReminderInput = {
  title: string;
  category: 'birthday' | 'medical' | 'dental' | 'appointment' | 'annual_exam' | 'general_reminder';
  eventDate: string;
  eventTime: string;
  assigneeComradeId: string;
};

type UseReminderMutationsArgs = {
  onRefresh: () => Promise<void>;
};

type UseReminderMutationsResult = {
  isAdding: boolean;
  completingId: string | null;
  addReminder: (input: CreateReminderInput) => Promise<void>;
  completeReminder: (reminderId: string) => Promise<void>;
};

export function useReminderMutations({
  onRefresh,
}: UseReminderMutationsArgs): UseReminderMutationsResult {
  const [isAdding, setIsAdding] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);

  async function addReminder(input: CreateReminderInput): Promise<void> {
    setIsAdding(true);
    try {
      const payload: Record<string, unknown> = {
        title: input.title.trim(),
        category: input.category,
        eventDate: input.eventDate,
        assignedComradeIds: input.assigneeComradeId.length > 0 ? [input.assigneeComradeId] : [],
      };
      if (input.eventTime.trim().length > 0) {
        payload.eventTime = input.eventTime.trim();
      }
      await apiJsonValidated(DashboardApiResource.Reminders, createReminderResponseSchema, {
        method: 'POST',
        json: payload,
      });
      await onRefresh();
    } finally {
      setIsAdding(false);
    }
  }

  async function completeReminder(reminderId: string): Promise<void> {
    setCompletingId(reminderId);
    try {
      await apiJsonValidated(
        dashboardApiReminderCompletePath(reminderId),
        completeReminderResponseSchema,
        { method: 'POST', json: {} },
      );
      await onRefresh();
    } finally {
      setCompletingId(null);
    }
  }

  return { isAdding, completingId, addReminder, completeReminder };
}
