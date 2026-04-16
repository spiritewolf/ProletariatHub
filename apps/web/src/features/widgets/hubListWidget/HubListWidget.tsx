import { Box, Center, Spinner, Stack } from '@chakra-ui/react';
import { type HubListItem, HubListItemPriority, HubListItemStatus } from '@proletariat-hub/types';
import { useFindUniqueHubList } from '@proletariat-hub/web/shared/trpc/queries';
import type { ReactElement } from 'react';
import { useState } from 'react';

import { AddItemModal } from './components/AddItemModal';
import { HubListWidgetEmptyState } from './components/HubListWidgetEmptyState';
import { HubListWidgetHeader } from './components/HubListWidgetHeader';
import { HubListWidgetItem } from './components/HubListWidgetItem';
import { HubListWidgetSection } from './components/HubListWidgetSection';
import { HubListWidgetWrapper } from './componentstwo/HubListWidgetWrapper';
import { HubListItemDisplayStatus } from './types';

const PRIORITY_RANK: Record<HubListItemPriority, number> = {
  [HubListItemPriority.URGENT]: 0,
  [HubListItemPriority.HIGH]: 1,
  [HubListItemPriority.MEDIUM]: 2,
  [HubListItemPriority.LOW]: 3,
};

function partitionHubListItems(items: HubListItem[]): {
  active: HubListItem[];
  claimed: HubListItem[];
  purchased: HubListItem[];
} {
  const active = items
    .filter((item) => item.status === HubListItemStatus.ACTIVE)
    .sort((a, b) => {
      const byPriority = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      if (byPriority !== 0) {
        return byPriority;
      }
      return a.id.localeCompare(b.id);
    });
  const claimed = items.filter((item) => item.status === HubListItemStatus.CLAIMED);
  const purchased = items.filter((item) => item.status === HubListItemStatus.PURCHASED);
  return { active, claimed, purchased };
}

export function HubListWidget(): ReactElement {
  const [addItemModalKey, setAddItemModalKey] = useState(0);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const { data: hubList, isLoading } = useFindUniqueHubList();
  const listItems = hubList.items;
  const { active, claimed, purchased } = partitionHubListItems(listItems);

  const hasActive = active.length > 0;
  const hasClaimed = claimed.length > 0;
  const hasPurchased = purchased.length > 0;
  const isEmpty = listItems.length === 0;

  return (
    <HubListWidgetWrapper>
      <HubListWidgetHeader
        activeCount={active.length}
        onAddClick={() => {
          setAddItemModalKey((k) => k + 1);
          setIsAddItemOpen(true);
        }}
      />
      <AddItemModal
        key={addItemModalKey}
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
      />
      <Box flex="1" minH="0" overflowY="auto" py="2">
        {isLoading ? (
          <Center py="12">
            <Spinner size="lg" color="accent.primary" />
          </Center>
        ) : isEmpty ? (
          <HubListWidgetEmptyState />
        ) : (
          <Stack gap="0" w="full" pb="4">
            {hasActive ? (
              <Stack gap="0" w="full">
                {active.map((item, index) => (
                  <HubListWidgetItem
                    key={item.id}
                    hubListId={hubList.id}
                    item={item}
                    displayStatus={HubListItemDisplayStatus.ACTIVE}
                    isLastRowInSection={index === active.length - 1}
                  />
                ))}
              </Stack>
            ) : null}
            {hasClaimed ? (
              <HubListWidgetSection dividerLabel="Claimed">
                {claimed.map((item, index) => (
                  <HubListWidgetItem
                    key={item.id}
                    item={item}
                    displayStatus={HubListItemDisplayStatus.CLAIMED}
                    isLastRowInSection={index === claimed.length - 1}
                  />
                ))}
              </HubListWidgetSection>
            ) : null}
            {hasPurchased ? (
              <HubListWidgetSection dividerLabel="Recently purchased">
                {purchased.map((item, index) => (
                  <HubListWidgetItem
                    key={item.id}
                    item={item}
                    displayStatus={HubListItemDisplayStatus.PURCHASED}
                    isLastRowInSection={index === purchased.length - 1}
                  />
                ))}
              </HubListWidgetSection>
            ) : null}
          </Stack>
        )}
      </Box>
    </HubListWidgetWrapper>
  );
}
