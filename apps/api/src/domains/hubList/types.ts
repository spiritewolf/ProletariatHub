import type {
  ComradeDbRecord,
  HubInventoryProductCategoryDbRecord,
  HubInventoryProductDbRecord as HubInventoryProductDbRecordBase,
  HubInventoryVendorDbRecord,
  HubListDbRecord as HubListDbRecordBase,
  HubListItemDbRecord as HubListItemDbRecordBase,
} from '@proletariat-hub/database';

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
