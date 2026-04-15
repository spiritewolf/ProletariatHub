import { HubListItemDisplayStatus } from './types';

export const PRIORITY_CONFIG = {
  URGENT: { bg: 'error.subtle', color: 'error.fg' },
  HIGH: { bg: 'warning.subtle', color: 'warning.fg' },
  MEDIUM: { bg: 'hubList.priorityMedium.bg', color: 'hubList.priorityMedium.fg' },
  LOW: { bg: 'hubList.priorityLow.bg', color: 'hubList.priorityLow.fg' },
} as const;

export type HubListPriority = keyof typeof PRIORITY_CONFIG;

export type HubListMockItem = {
  id: string;
  productName: string;
  brand: string | null;
  vendor: string | null;
  priority: HubListPriority;
  status: HubListItemDisplayStatus;
  claimedBy: { username: string; displayInitial: string } | null;
};

export const MOCK_HUB_LIST_ITEMS: HubListMockItem[] = [
  {
    id: '1',
    productName: 'Oat milk',
    brand: 'Oatly barista',
    vendor: "Trader Joe's",
    priority: 'URGENT',
    status: HubListItemDisplayStatus.ACTIVE,
    claimedBy: null,
  },
  {
    id: '2',
    productName: 'Paper towels',
    brand: 'Bounty',
    vendor: 'Target',
    priority: 'HIGH',
    status: HubListItemDisplayStatus.ACTIVE,
    claimedBy: null,
  },
  {
    id: '3',
    productName: 'Cat litter',
    brand: 'Fresh Step',
    vendor: 'PetCo',
    priority: 'MEDIUM',
    status: HubListItemDisplayStatus.ACTIVE,
    claimedBy: null,
  },
  {
    id: '4',
    productName: 'Bananas',
    brand: 'Dole',
    vendor: "Trader Joe's",
    priority: 'LOW',
    status: HubListItemDisplayStatus.ACTIVE,
    claimedBy: null,
  },
  {
    id: '8',
    productName: 'Coffee beans',
    brand: 'Blue Bottle',
    vendor: "Trader Joe's",
    priority: 'HIGH',
    status: HubListItemDisplayStatus.ACTIVE,
    claimedBy: null,
  },
  {
    id: '5',
    productName: 'Laundry detergent free & clear',
    brand: 'Tide',
    vendor: 'Costco',
    priority: 'MEDIUM',
    status: HubListItemDisplayStatus.CLAIMED,
    claimedBy: { username: 'Wife', displayInitial: 'W' },
  },
  {
    id: '6',
    productName: 'Dish soap',
    brand: 'Dawn',
    vendor: 'Amazon',
    priority: 'LOW',
    status: HubListItemDisplayStatus.PURCHASED,
    claimedBy: { username: 'Husband', displayInitial: 'H' },
  },
  {
    id: '7',
    productName: 'Sponges',
    brand: 'Scotch-Brite',
    vendor: 'Amazon',
    priority: 'LOW',
    status: HubListItemDisplayStatus.PURCHASED,
    claimedBy: { username: 'Husband', displayInitial: 'H' },
  },
];
