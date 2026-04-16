import { HubListItemPriority } from '@proletariat-hub/types';

export const PRIORITY_CONFIG = {
  [HubListItemPriority.URGENT]: { bg: 'error.subtle', color: 'error.fg' },
  [HubListItemPriority.HIGH]: { bg: 'warning.subtle', color: 'warning.fg' },
  [HubListItemPriority.MEDIUM]: {
    bg: 'hubList.priorityMedium.bg',
    color: 'hubList.priorityMedium.fg',
  },
  [HubListItemPriority.LOW]: { bg: 'hubList.priorityLow.bg', color: 'hubList.priorityLow.fg' },
} as const;
