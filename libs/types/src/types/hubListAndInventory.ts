export const HubListItemStatus = {
  ACTIVE: 'ACTIVE',
  CLAIMED: 'CLAIMED',
  PURCHASED: 'PURCHASED',
} as const;
export type HubListItemStatus = (typeof HubListItemStatus)[keyof typeof HubListItemStatus];

export const HubListItemPriority = {
  URGENT: 'URGENT',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
} as const;
export type HubListItemPriority = (typeof HubListItemPriority)[keyof typeof HubListItemPriority];

export const HubInventoryProductFrequency = {
  ONE_TIME: 'ONE_TIME',
  WEEKLY: 'WEEKLY',
  BIWEEKLY: 'BIWEEKLY',
  MONTHLY: 'MONTHLY',
  CUSTOM: 'CUSTOM',
} as const;
export type HubInventoryProductFrequency =
  (typeof HubInventoryProductFrequency)[keyof typeof HubInventoryProductFrequency];

export const HubInventoryVendorFulfillmentType = {
  ONLINE: 'ONLINE',
  IN_STORE: 'IN_STORE',
  BOTH: 'BOTH',
} as const;
export type HubInventoryVendorFulfillmentType =
  (typeof HubInventoryVendorFulfillmentType)[keyof typeof HubInventoryVendorFulfillmentType];

export const HubInventoryStorageLocation = {
  PANTRY: 'PANTRY',
  FRIDGE: 'FRIDGE',
  FREEZER: 'FREEZER',
  BEDROOM: 'BEDROOM',
  BATHROOM: 'BATHROOM',
  LAUNDRY: 'LAUNDRY',
  GARAGE: 'GARAGE',
  OTHER: 'OTHER',
} as const;
export type HubInventoryStorageLocation =
  (typeof HubInventoryStorageLocation)[keyof typeof HubInventoryStorageLocation];

export type HubListComradeSnippet = {
  username: string;
  displayInitial: string;
};

export type HubListItem = {
  id: string;
  status: HubListItemStatus;
  priority: HubListItemPriority;
  quantity: number | null;
  notes: string | null;
  createdAt: Date;
  productId: string;
  productName: string;
  productBrand: string | null;
  vendorName: string | null;
  categoryName: string | null;
  claimedBy: HubListComradeSnippet | null;
  purchasedBy: HubListComradeSnippet | null;
};

export type HubList = {
  id: string;
  name: string;
  createdAt: Date;
  items: HubListItem[];
};

export type HubInventoryProduct = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
  name: string;
  brandName: string | null;
  description: string | null;
  productCode: string | null;
  productUrl: string | null;
  purchaseFrequency: HubInventoryProductFrequency;
  customFrequencyDays: number | null;
  notes: string | null;
  quantityInStock: number;
  lastPurchasedAt: Date | null;
  lastPurchasedById: string | null;
  minStockThreshold: number | null;
  urgentStockThreshold: number | null;
  expiresAt: Date | null;
  openedAt: Date | null;
  storageLocation: HubInventoryStorageLocation | null;
  storageLocationOpened: HubInventoryStorageLocation | null;
  storageNotes: string | null;
  shelfLifeDays: number | null;
  shelfLifeOpenedDays: number | null;
  categoryId: string | null;
  vendorId: string | null;
  hubId: string;
  createdById: string;
};

export type HubInventoryProductCategory = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  hubId: string;
};

export type HubInventoryVendor = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  website: string | null;
  fulfillmentType: HubInventoryVendorFulfillmentType;
  notes: string | null;
  hubId: string;
};
