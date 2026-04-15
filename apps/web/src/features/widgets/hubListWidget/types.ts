export const HubListItemDisplayStatus = {
  ACTIVE: 'ACTIVE',
  CLAIMED: 'CLAIMED',
  PURCHASED: 'PURCHASED',
} as const;

export type HubListItemDisplayStatus =
  (typeof HubListItemDisplayStatus)[keyof typeof HubListItemDisplayStatus];
