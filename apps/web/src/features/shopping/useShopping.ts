import {
  createShoppingItemBodySchema,
  createShoppingItemResponseSchema,
  shoppingItemSingleResponseSchema,
  type ShoppingItemsListStatus,
  shoppingItemsResponseSchema,
  shoppingListsResponseSchema,
} from '@proletariat-hub/contracts';
import { useCallback } from 'react';
import { z } from 'zod';

import { apiJsonValidated } from '@/lib/api';

type CreateItemPayload = z.infer<typeof createShoppingItemBodySchema>;

export function useShopping() {
  const fetchLists = useCallback(async () => {
    const data = await apiJsonValidated('/api/shopping/lists', shoppingListsResponseSchema);
    return data.lists;
  }, []);

  const fetchItems = useCallback(async (listId: string, status: ShoppingItemsListStatus) => {
    const query = status === 'open' ? '' : `?status=${status}`;
    const data = await apiJsonValidated(
      `/api/shopping/lists/${listId}/items${query}`,
      shoppingItemsResponseSchema,
    );
    return data.items;
  }, []);

  const createItem = useCallback(async (listId: string, payload: CreateItemPayload) => {
    const data = await apiJsonValidated(
      `/api/shopping/lists/${listId}/items`,
      createShoppingItemResponseSchema,
      { method: 'POST', json: payload },
    );
    return data.item;
  }, []);

  const markOrdered = useCallback(async (listId: string, itemId: string) => {
    await apiJsonValidated(
      `/api/shopping/lists/${listId}/items/${itemId}/mark-ordered`,
      shoppingItemSingleResponseSchema,
      { method: 'POST', json: {} },
    );
  }, []);

  const markReopened = useCallback(async (listId: string, itemId: string) => {
    await apiJsonValidated(
      `/api/shopping/lists/${listId}/items/${itemId}/mark-reopened`,
      shoppingItemSingleResponseSchema,
      { method: 'POST', json: {} },
    );
  }, []);

  return { fetchLists, fetchItems, createItem, markOrdered, markReopened };
}
