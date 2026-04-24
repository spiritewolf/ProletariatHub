import { Box, Center, Spinner, Stack, useDisclosure } from '@chakra-ui/react';
import { HubListItemPriority, HubListItemStatus } from '@proletariat-hub/types';
import { useClaimManyListItems } from '@proletariat-hub/web/shared/trpc/mutations';
import { useFindUniqueHubList } from '@proletariat-hub/web/shared/trpc/queries';
import { toaster } from '@proletariat-hub/web/shared/ui';
import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';

import { AddItemModal } from './addItemModal/AddItemModal';
import { HubListWidgetEmptyState } from './components/HubListWidgetEmptyState';
import { HubListWidgetHeader } from './components/HubListWidgetHeader';
import { HubListWidgetItem } from './components/HubListWidgetItem';
import { HubListWidgetSection } from './components/HubListWidgetSection';
import { HubListWidgetWrapper } from './components/HubListWidgetWrapper';

const HUB_LIST_PRIORITY_ORDER: HubListItemPriority[] = [
  HubListItemPriority.URGENT,
  HubListItemPriority.HIGH,
  HubListItemPriority.MEDIUM,
  HubListItemPriority.LOW,
];

export function HubListWidget(): ReactElement {
  const addListItemModal = useDisclosure();
  const { data: hubList, isLoading } = useFindUniqueHubList();
  const listItems = hubList.items;
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(() => new Set());
  const claimManyListItems = useClaimManyListItems({
    onSuccess: (_data, variables) => {
      setSelectedItemIds(new Set());
      toaster.create({
        type: 'success',
        title: `Claimed ${variables.listItemIds.length} item(s)`,
      });
    },
    onError: (error) => {
      toaster.create({
        type: 'error',
        title: error.message,
      });
    },
  });

  const activeListItems = listItems
    .filter((item) => item.status === HubListItemStatus.ACTIVE)
    .sort(
      (leftItem, rightItem) =>
        HUB_LIST_PRIORITY_ORDER.indexOf(leftItem.priority) -
        HUB_LIST_PRIORITY_ORDER.indexOf(rightItem.priority),
    );
  const claimedListItems = listItems.filter((item) => item.status === HubListItemStatus.CLAIMED);
  const purchasedListItems = listItems.filter(
    (item) => item.status === HubListItemStatus.PURCHASED,
  );

  const toggleItemSelection = useCallback((itemId: string): void => {
    setSelectedItemIds((previousSelectedItemIds) => {
      const nextSelectedItemIds = new Set(previousSelectedItemIds);
      if (nextSelectedItemIds.has(itemId)) {
        nextSelectedItemIds.delete(itemId);
      } else {
        nextSelectedItemIds.add(itemId);
      }
      return nextSelectedItemIds;
    });
  }, []);

  const toggleSelectAll = useCallback((): void => {
    const activeItemIds = listItems
      .filter((item) => item.status === HubListItemStatus.ACTIVE)
      .map((item) => item.id);

    setSelectedItemIds((previousSelectedItemIds) => {
      const areAllActiveItemsSelected =
        activeItemIds.length > 0 &&
        activeItemIds.every((itemId) => previousSelectedItemIds.has(itemId));
      if (areAllActiveItemsSelected) {
        return new Set();
      }
      return new Set(activeItemIds);
    });
  }, [listItems]);

  const isEmpty = listItems.length === 0;
  const claimSelectedItems = (): void => {
    console.log('====selectedItemIds', selectedItemIds);
    const selectedListItemIds = Array.from(selectedItemIds);
    const firstListItemId = selectedListItemIds[0];
    if (!firstListItemId) {
      toaster.create({
        type: 'error',
        title: 'Select at least one item to claim.',
      });
      return;
    }
    const remainingListItemIds = selectedListItemIds.slice(1);

    claimManyListItems.mutate({
      listItemIds: [firstListItemId, ...remainingListItemIds],
    });
  };

  return (
    <HubListWidgetWrapper>
      <HubListWidgetHeader
        activeListItems={activeListItems}
        selectedItemIds={selectedItemIds}
        onClaimSelected={claimSelectedItems}
        isClaimPending={claimManyListItems.isPending}
        onAddListItem={addListItemModal.onOpen}
        onToggleSelectAll={toggleSelectAll}
      />
      <AddItemModal isOpen={addListItemModal.open} onClose={addListItemModal.onClose} />
      <Box flex="1" minH="0" overflowY="auto" py="2">
        <Stack gap="0" w="full" pb="4">
          {isLoading ? (
            <Center py="12">
              <Spinner size="lg" color="accent.primary" />
            </Center>
          ) : null}
          {isEmpty ? (
            <HubListWidgetEmptyState
              onAddClick={() => {
                addListItemModal.onOpen();
              }}
            />
          ) : null}
          {activeListItems.length > 0 ? (
            <Stack gap="0" w="full">
              <HubListWidgetSection dividerLabel="Active" shouldDisplaySeparator={false}>
                {activeListItems.map((item, index) => (
                  <HubListWidgetItem
                    key={item.id}
                    hubListId={hubList.id}
                    item={item}
                    isLastRowInSection={index === activeListItems.length - 1}
                    itemSelection={{
                      isSelected: selectedItemIds.has(item.id),
                      onToggle: () => toggleItemSelection(item.id),
                    }}
                  />
                ))}
              </HubListWidgetSection>
            </Stack>
          ) : null}
          {claimedListItems.length > 0 ? (
            <HubListWidgetSection dividerLabel="Claimed" shouldDisplaySeparator={true}>
              {claimedListItems.map((item, index) => (
                <HubListWidgetItem
                  key={item.id}
                  item={item}
                  hubListId={hubList.id}
                  isLastRowInSection={index === claimedListItems.length - 1}
                />
              ))}
            </HubListWidgetSection>
          ) : null}
          {purchasedListItems.length > 0 ? (
            <HubListWidgetSection dividerLabel="Purchased" shouldDisplaySeparator={true}>
              {purchasedListItems.map((item, index) => (
                <HubListWidgetItem
                  key={item.id}
                  item={item}
                  hubListId={hubList.id}
                  isLastRowInSection={index === purchasedListItems.length - 1}
                />
              ))}
            </HubListWidgetSection>
          ) : null}
        </Stack>
      </Box>
    </HubListWidgetWrapper>
  );
}
