import { Box, Button, Field, Flex, Input, NativeSelect, Stack, Text } from '@chakra-ui/react';
import {
  createShoppingItemBodySchema,
  createShoppingItemResponseSchema,
  type ShoppingItemRow,
  shoppingItemSingleResponseSchema,
  type ShoppingItemsListStatus,
  shoppingItemsResponseSchema,
  type ShoppingListRow,
  shoppingListsResponseSchema,
  shoppingPrioritySchema,
} from '@proletariat-hub/contracts';
import { type FormEvent, useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { DashboardListRow } from '../dashboard/components/DashboardListRow';
import { DashboardPriorityBadge } from '../dashboard/components/DashboardPriorityBadge';
import { DashboardWidget } from '../dashboard/components/DashboardWidget';
import { dashboardTheme } from '../dashboard/dashboardTheme';
import { AuthenticatedShell } from '../dashboard/shell/AuthenticatedShell';
import { PageChromeTopBar } from '../dashboard/shell/PageChromeTopBar';
import { getShoppingPurchaseChannelLabel } from '../dashboard/utils/shoppingDisplay';
import { useAuth } from '../features/auth/useAuth';
import { apiJsonValidated } from '../lib/api';
import { AppPath } from '../lib/appPaths';

function parseShoppingPriority(value: string): 'urgent' | 'medium' | 'low' | null {
  const parsed = shoppingPrioritySchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

function formatOrderedAt(ms: number): string {
  return new Date(ms).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function shoppingItemMetaLine(item: ShoppingItemRow, itemTab: ShoppingItemsListStatus): string {
  const channel = getShoppingPurchaseChannelLabel(item.purchaseType);
  if (itemTab === 'ordered' && item.orderedAt !== null) {
    return `${channel} · ordered ${formatOrderedAt(item.orderedAt)}`;
  }
  return channel;
}

const fieldLabelProps = {
  fontSize: '8px',
  color: dashboardTheme.meta,
  fontWeight: 'semibold' as const,
  mb: 0.5,
};

const inputStyles = {
  bg: 'white',
  borderColor: dashboardTheme.cardBorder,
  color: dashboardTheme.text,
  fontSize: 'sm',
  _focusVisible: { borderColor: dashboardTheme.title },
};

export function ShoppingPage() {
  const { authenticatedComrade } = useAuth();
  const [lists, setLists] = useState<ShoppingListRow[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [itemTab, setItemTab] = useState<ShoppingItemsListStatus>('open');
  const [items, setItems] = useState<ShoppingItemRow[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPriority, setNewItemPriority] = useState<'urgent' | 'medium' | 'low'>('medium');
  const [error, setError] = useState<string | null>(null);
  const [loadingLists, setLoadingLists] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);
  const [pendingAdd, setPendingAdd] = useState(false);
  const [markingItemId, setMarkingItemId] = useState<string | null>(null);
  const [reopeningItemId, setReopeningItemId] = useState<string | null>(null);

  const loadLists = useCallback(async () => {
    setLoadingLists(true);
    setError(null);
    try {
      const data = await apiJsonValidated('/api/shopping/lists', shoppingListsResponseSchema);
      setLists(data.lists);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load lists');
    } finally {
      setLoadingLists(false);
    }
  }, []);

  const loadItems = useCallback(async (listId: string, status: ShoppingItemsListStatus) => {
    setLoadingItems(true);
    setError(null);
    try {
      const query = status === 'open' ? '' : `?status=${status}`;
      const data = await apiJsonValidated(
        `/api/shopping/lists/${listId}/items${query}`,
        shoppingItemsResponseSchema,
      );
      setItems(data.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load items');
    } finally {
      setLoadingItems(false);
    }
  }, []);

  useEffect(() => {
    void loadLists();
  }, [loadLists]);

  useEffect(() => {
    if (lists.length === 0 || activeListId !== null) {
      return;
    }
    const hubList = lists.find((l) => l.listKind === 'hub');
    setActiveListId(hubList?.id ?? lists[0].id);
  }, [lists, activeListId]);

  useEffect(() => {
    if (!activeListId) {
      return;
    }
    void loadItems(activeListId, itemTab);
  }, [activeListId, itemTab, loadItems]);

  if (!authenticatedComrade) {
    return <Navigate to={AppPath.Login} replace />;
  }
  if (authenticatedComrade.mustChangePassword) {
    return <Navigate to={AppPath.ChangePassword} replace />;
  }
  if (authenticatedComrade.isAdmin && !authenticatedComrade.hasCompletedSetup) {
    return <Navigate to={AppPath.Setup} replace />;
  }

  async function onAddItem(e: FormEvent) {
    e.preventDefault();
    if (!activeListId) {
      return;
    }
    setError(null);
    const parsed = createShoppingItemBodySchema.safeParse({
      name: newItemName,
      priority: newItemPriority,
    });
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      setError(first?.message ?? 'Invalid item');
      return;
    }
    setPendingAdd(true);
    try {
      const created = await apiJsonValidated(
        `/api/shopping/lists/${activeListId}/items`,
        createShoppingItemResponseSchema,
        { method: 'POST', json: parsed.data },
      );
      setItems((prev) => [...prev, created.item]);
      setNewItemName('');
      await loadLists();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add item');
    } finally {
      setPendingAdd(false);
    }
  }

  async function onMarkOrdered(itemId: string) {
    if (!activeListId) {
      return;
    }
    setError(null);
    setMarkingItemId(itemId);
    try {
      await apiJsonValidated(
        `/api/shopping/lists/${activeListId}/items/${itemId}/mark-ordered`,
        shoppingItemSingleResponseSchema,
        { method: 'POST', json: {} },
      );
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      await loadLists();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update item');
    } finally {
      setMarkingItemId(null);
    }
  }

  async function onMarkReopened(itemId: string) {
    if (!activeListId) {
      return;
    }
    setError(null);
    setReopeningItemId(itemId);
    try {
      await apiJsonValidated(
        `/api/shopping/lists/${activeListId}/items/${itemId}/mark-reopened`,
        shoppingItemSingleResponseSchema,
        { method: 'POST', json: {} },
      );
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      await loadLists();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update item');
    } finally {
      setReopeningItemId(null);
    }
  }

  const activeList = lists.find((l) => l.id === activeListId);
  const showAddForm = itemTab === 'open';

  const listSectionTitle =
    activeList != null
      ? itemTab === 'ordered'
        ? `${activeList.name} · ordered`
        : activeList.name
      : 'Items';

  return (
    <AuthenticatedShell topBar={<PageChromeTopBar title="Shopping" />}>
      <Box maxW="40rem" w="100%" mx="auto">
        {error ? (
          <Text fontSize="10px" color="red.600" mb={2}>
            {error}
          </Text>
        ) : null}

        {loadingLists ? (
          <Text fontSize="9px" color={dashboardTheme.meta}>
            Loading lists…
          </Text>
        ) : lists.length === 0 ? (
          <Text fontSize="9px" color={dashboardTheme.meta}>
            No shopping lists yet.
          </Text>
        ) : (
          <Stack gap={3}>
            <Field.Root maxW="sm">
              <Field.Label {...fieldLabelProps}>Active list</Field.Label>
              <NativeSelect.Root size="sm">
                <NativeSelect.Field
                  {...inputStyles}
                  h="32px"
                  value={activeListId ?? ''}
                  onChange={(e) => setActiveListId(e.target.value)}
                >
                  {lists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.name} ({list.itemCount} open)
                    </option>
                  ))}
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Field.Root>

            <Flex gap={1} flexWrap="wrap">
              <Button
                type="button"
                size="xs"
                fontSize="9px"
                h="22px"
                variant={itemTab === 'open' ? 'solid' : 'outline'}
                bg={itemTab === 'open' ? dashboardTheme.title : 'transparent'}
                color={itemTab === 'open' ? 'white' : dashboardTheme.title}
                borderColor={dashboardTheme.cardBorder}
                onClick={() => setItemTab('open')}
              >
                Open items
              </Button>
              <Button
                type="button"
                size="xs"
                fontSize="9px"
                h="22px"
                variant={itemTab === 'ordered' ? 'solid' : 'outline'}
                bg={itemTab === 'ordered' ? dashboardTheme.title : 'transparent'}
                color={itemTab === 'ordered' ? 'white' : dashboardTheme.title}
                borderColor={dashboardTheme.cardBorder}
                onClick={() => setItemTab('ordered')}
              >
                Ordered (history)
              </Button>
            </Flex>

            <DashboardWidget title={listSectionTitle} flexShrink={0}>
              {loadingItems ? (
                <Text fontSize="9px" color={dashboardTheme.meta}>
                  Loading items…
                </Text>
              ) : items.length === 0 ? (
                <Text fontSize="9px" color={dashboardTheme.meta}>
                  {itemTab === 'open'
                    ? 'Nothing on this list yet. Add something below.'
                    : 'No ordered items on this list yet.'}
                </Text>
              ) : (
                <Stack gap={1}>
                  {items.map((item) => (
                    <Box key={item.id}>
                      <DashboardListRow
                        leading={
                          <Box
                            borderRadius="full"
                            borderWidth="1px"
                            borderColor={dashboardTheme.cardBorder}
                            w="12px"
                            h="12px"
                          />
                        }
                        title={item.name}
                        meta={shoppingItemMetaLine(item, itemTab)}
                        trailing={
                          <>
                            <DashboardPriorityBadge priority={item.priority} />
                            {itemTab === 'open' ? (
                              <Button
                                type="button"
                                size="xs"
                                fontSize="8px"
                                h="20px"
                                px={1.5}
                                variant="outline"
                                borderColor={dashboardTheme.cardBorder}
                                color={dashboardTheme.title}
                                loading={markingItemId === item.id}
                                onClick={() => void onMarkOrdered(item.id)}
                              >
                                Mark ordered
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                size="xs"
                                fontSize="8px"
                                h="20px"
                                px={1.5}
                                variant="outline"
                                borderColor={dashboardTheme.cardBorder}
                                color={dashboardTheme.title}
                                loading={reopeningItemId === item.id}
                                onClick={() => void onMarkReopened(item.id)}
                              >
                                Put back
                              </Button>
                            )}
                          </>
                        }
                      />
                      {item.notes ? (
                        <Text fontSize="8px" color={dashboardTheme.meta} pl={6} mt={0.5}>
                          {item.notes}
                        </Text>
                      ) : null}
                    </Box>
                  ))}
                </Stack>
              )}
            </DashboardWidget>

            {showAddForm ? (
              <DashboardWidget title="Add item" flexShrink={0}>
                <form onSubmit={onAddItem}>
                  <Stack gap={3} maxW="md">
                    <Field.Root>
                      <Field.Label {...fieldLabelProps}>Name</Field.Label>
                      <Input
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="Coffee, paper towels…"
                        size="sm"
                        h="32px"
                        required
                        {...inputStyles}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label {...fieldLabelProps}>Priority</Field.Label>
                      <NativeSelect.Root size="sm">
                        <NativeSelect.Field
                          {...inputStyles}
                          h="32px"
                          value={newItemPriority}
                          onChange={(e) => {
                            const nextPriority = parseShoppingPriority(e.target.value);
                            if (nextPriority !== null) {
                              setNewItemPriority(nextPriority);
                            }
                          }}
                        >
                          <option value="urgent">Urgent</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </NativeSelect.Field>
                      </NativeSelect.Root>
                    </Field.Root>
                    <Button
                      type="submit"
                      size="xs"
                      fontSize="9px"
                      h="28px"
                      loading={pendingAdd}
                      bg={dashboardTheme.title}
                      color="white"
                      alignSelf="flex-start"
                    >
                      Add to list
                    </Button>
                  </Stack>
                </form>
              </DashboardWidget>
            ) : null}
          </Stack>
        )}
      </Box>
    </AuthenticatedShell>
  );
}
