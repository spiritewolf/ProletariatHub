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

export function getChoreFrequencyDisplayLabel(
  frequency: ChoreListItem['frequency'],
): string {
  return CHORE_FREQUENCY_DISPLAY_LABEL[frequency as ChoreRecurrenceFrequency];
}

export function formatChoreRowMetaLine(chore: ChoreListItem): string {
  const frequencyLabel = getChoreFrequencyDisplayLabel(chore.frequency);
  const assignee = chore.assigneeUsername;
  const lastCompletedSegment =
    chore.lastCompletedAt != null
      ? ` · last ${new Date(chore.lastCompletedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
      : '';
  return `${frequencyLabel} · ${assignee}${lastCompletedSegment}`;
}
