import { Box, Button, Field, Input, NativeSelect, Stack, Text } from '@chakra-ui/react';
import {
  createShoppingItemBodySchema,
  type ShoppingItemRow,
  type ShoppingItemsListStatus,
  type ShoppingListRow,
  shoppingPrioritySchema,
} from '@proletariat-hub/contracts';
import { type FormEvent, useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router';

import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageChromeTopBar } from '@/components/layout/PageChromeTopBar';
import { DashboardListRow } from '@/components/ui/DashboardListRow';
import { DashboardPriorityBadge } from '@/components/ui/DashboardPriorityBadge';
import { DashboardWidget } from '@/components/ui/DashboardWidget';
import { TabRow } from '@/components/ui/TabRow';
import { useAuth } from '@/features/auth/useAuth';
import { getShoppingPurchaseChannelLabel } from '@/features/shopping/shoppingDisplay';
import { useShopping } from '@/features/shopping/useShopping';
import { AppPath } from '@/lib/appPaths';
import { dashboardTheme } from '@/styles/dashboardTheme';

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

const shoppingItemTabOptions = [
  { value: 'open', label: 'Open items' },
  { value: 'ordered', label: 'Ordered (history)' },
] as const;

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

export default function ShoppingPage(): React.ReactElement {
  const { authenticatedComrade } = useAuth();
  const { fetchLists, fetchItems, createItem, markOrdered, markReopened } = useShopping();
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
      const listsData = await fetchLists();
      setLists(listsData);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load lists');
    } finally {
      setLoadingLists(false);
    }
  }, [fetchLists]);

  const loadItems = useCallback(
    async (listId: string, status: ShoppingItemsListStatus) => {
      setLoadingItems(true);
      setError(null);
      try {
        const itemsData = await fetchItems(listId, status);
        setItems(itemsData);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load items');
      } finally {
        setLoadingItems(false);
      }
    },
    [fetchItems],
  );

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
      const item = await createItem(activeListId, parsed.data);
      setItems((prev) => [...prev, item]);
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
      await markOrdered(activeListId, itemId);
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
      await markReopened(activeListId, itemId);
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
    <DashboardShell topBar={<PageChromeTopBar title="Shopping" />}>
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

            <TabRow
              value={itemTab === 'ordered' ? 'ordered' : 'open'}
              options={shoppingItemTabOptions}
              onChange={setItemTab}
            />

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
    </DashboardShell>
  );
}
