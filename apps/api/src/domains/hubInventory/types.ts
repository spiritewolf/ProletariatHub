import type {
  HubInventoryProductFrequency,
  HubInventoryVendorFulfillmentType,
} from '@proletariat-hub/types';

export type {
  HubInventoryProductCategoryDbRecord,
  HubInventoryProductDbRecord,
  HubInventoryVendorDbRecord,
} from '@proletariat-hub/database';

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
