import type { ChoreListItem } from '@proletariat-hub/contracts';

/** Matches API / contract `choreFrequencySchema` values. */
export enum ChoreRecurrenceFrequency {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
  Custom = 'custom',
}

export const CHORE_FREQUENCY_DISPLAY_LABEL: Record<ChoreRecurrenceFrequency, string> = {
  [ChoreRecurrenceFrequency.Daily]: 'Daily',
  [ChoreRecurrenceFrequency.Weekly]: 'Weekly',
  [ChoreRecurrenceFrequency.Monthly]: 'Monthly',
  [ChoreRecurrenceFrequency.Custom]: 'Custom',
};

const CHORE_RECURRENCE_BY_VALUE: Record<ChoreListItem['frequency'], ChoreRecurrenceFrequency> = {
  daily: ChoreRecurrenceFrequency.Daily,
  weekly: ChoreRecurrenceFrequency.Weekly,
  monthly: ChoreRecurrenceFrequency.Monthly,
  custom: ChoreRecurrenceFrequency.Custom,
};

export function getChoreFrequencyDisplayLabel(frequency: ChoreListItem['frequency']): string {
  return CHORE_FREQUENCY_DISPLAY_LABEL[CHORE_RECURRENCE_BY_VALUE[frequency]];
}

export function formatChoreRowMetaLine(chore: ChoreListItem): string {
  const frequencyLabel = getChoreFrequencyDisplayLabel(chore.frequency);
  const assignee = chore.assigneeUsername;
  const rotateSegment = chore.rotateAcrossHub ? ' · rotating' : '';
  const lastCompletedSegment =
    chore.lastCompletedAt != null
      ? ` · last ${new Date(chore.lastCompletedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
      : '';
  return `${frequencyLabel} · ${assignee}${rotateSegment}${lastCompletedSegment}`;
}
