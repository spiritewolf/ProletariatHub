import type {
  HubInventoryProductCategoryDbRecord,
  HubInventoryProductDbRecord,
  HubInventoryVendorDbRecord,
} from '@proletariat-hub/database';
import type {
  HubInventoryProductFrequency,
  HubInventoryVendorFulfillmentType,
} from '@proletariat-hub/types';

export type {
  HubInventoryProductCategoryDbRecord,
  HubInventoryProductDbRecord,
  HubInventoryVendorDbRecord,
} from '@proletariat-hub/database';

export interface HubInventoryProductWithCategoryVendorDbRecord extends HubInventoryProductDbRecord {
  category: HubInventoryProductCategoryDbRecord | null;
  vendor: HubInventoryVendorDbRecord | null;
}

export interface HubInventoryProductParseSource extends HubInventoryProductDbRecord {
  category?: HubInventoryProductCategoryDbRecord | null;
  vendor?: HubInventoryVendorDbRecord | null;
}

export type CreateOneHubInventoryProductInputData = {
  createdById: string;
  name: string;
  brandName: string | null;
  categoryId: string | null;
  vendorId: string | null;
  purchaseFrequency: HubInventoryProductFrequency;
  customFrequencyDays: number | null;
  notes: string | null;
  quantityInStock: number;
};

export type CreateOneHubInventoryVendorInputData = {
  name: string;
  fulfillmentType: HubInventoryVendorFulfillmentType;
};

export type FindHubInventoryVendorNullableWhereFirstInput = {
  hubId: string;
  id?: string;
  productId?: string;
  searchText?: string;
};
