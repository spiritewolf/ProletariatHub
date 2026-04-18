import type {
  ComradeDbRecord,
  HubInventoryProductCategoryDbRecord,
  HubInventoryProductDbRecord as HubInventoryProductDbRecordBase,
  HubInventoryVendorDbRecord,
  HubListDbRecord as HubListDbRecordBase,
  HubListItemDbRecord as HubListItemDbRecordBase,
  Prisma,
} from '@proletariat-hub/database';
import type { HubListItemPriority } from '@proletariat-hub/types';

interface HubListItemProductDbRecord extends HubInventoryProductDbRecordBase {
  vendor: HubInventoryVendorDbRecord | null;
  category: HubInventoryProductCategoryDbRecord | null;
}

export interface HubListItemDbRecord extends HubListItemDbRecordBase {
  product: HubListItemProductDbRecord;
  claimedBy: ComradeDbRecord | null;
  purchasedBy: ComradeDbRecord | null;
  createdBy: ComradeDbRecord;
}

export interface HubListDbRecord extends HubListDbRecordBase {
  items: HubListItemDbRecord[];
}

export type HubListItemsOrderByInput = {
  priority: Prisma.SortOrder;
};

export type CreateOneHubListItemInputData = {
  listId: string;
  productId: string;
  createdById: string;
  status: string;
  priority: string;
  quantity: number | null;
  notes: string | null;
};

export type CreateOneHubListItemAccessInputData = {
  productId: string;
  createdById: string;
  priority: HubListItemPriority;
  quantity: number | null;
  notes: string | null;
};
