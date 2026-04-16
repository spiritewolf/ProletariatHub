import {
  type HubList,
  type HubListComradeSnippet,
  type HubListItem,
  HubListItemPriority,
  HubListItemStatus,
} from '@proletariat-hub/types';

import { validateConstEnumType } from '../../shared/util/helpers';
import type { HubListDbRecord, HubListItemDbRecord } from './types';

function mapComradeSnippet(comrade: { username: string } | null): HubListComradeSnippet | null {
  if (comrade === null) {
    return null;
  }
  return {
    username: comrade.username,
    displayInitial: comrade.username.charAt(0).toUpperCase(),
  };
}

export function parseHubListItem(dbRecord: HubListItemDbRecord): HubListItem {
  const quantity = dbRecord.quantity === null ? null : Number(dbRecord.quantity);

  return {
    id: dbRecord.id,
    status: validateConstEnumType(HubListItemStatus, dbRecord.status, 'hub list item status'),
    priority: validateConstEnumType(
      HubListItemPriority,
      dbRecord.priority,
      'hub list item priority',
    ),
    quantity,
    notes: dbRecord.notes,
    createdAt: dbRecord.createdAt,
    productId: dbRecord.productId,
    productName: dbRecord.product.name,
    productBrand: dbRecord.product.brandName,
    vendorName: dbRecord.product.vendor?.name ?? null,
    categoryName: dbRecord.product.category?.name ?? null,
    claimedBy: mapComradeSnippet(dbRecord.claimedBy),
    purchasedBy: mapComradeSnippet(dbRecord.purchasedBy),
  };
}

export function parseHubList(dbRecord: HubListDbRecord): HubList {
  return {
    id: dbRecord.id,
    name: dbRecord.name,
    createdAt: dbRecord.createdAt,
    items: dbRecord.items.map(parseHubListItem),
  };
}
