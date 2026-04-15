import { Box, Stack } from '@chakra-ui/react';
import type { ReactElement } from 'react';
import { useState } from 'react';

import { AddItemModal } from './components/AddItemModal';
import { HubListWidgetEmptyState } from './components/HubListWidgetEmptyState';
import { HubListWidgetHeader } from './components/HubListWidgetHeader';
import { HubListWidgetItem } from './components/HubListWidgetItem';
import { HubListWidgetSection } from './components/HubListWidgetSection';
import type { HubListMockItem, HubListPriority } from './mockData';
import { MOCK_HUB_LIST_ITEMS } from './mockData';
import { HubListItemDisplayStatus } from './types';

const PRIORITY_RANK: Record<HubListPriority, number> = {
  URGENT: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

function partitionHubListItems(items: HubListMockItem[]): {
  active: HubListMockItem[];
  claimed: HubListMockItem[];
  purchased: HubListMockItem[];
} {
  const active = items
    .filter((item) => item.status === HubListItemDisplayStatus.ACTIVE)
    .sort((a, b) => {
      const byPriority = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      if (byPriority !== 0) {
        return byPriority;
      }
      return a.id.localeCompare(b.id);
    });
  const claimed = items.filter((item) => item.status === HubListItemDisplayStatus.CLAIMED);
  const purchased = items.filter((item) => item.status === HubListItemDisplayStatus.PURCHASED);
  return { active, claimed, purchased };
}

type HubListWidgetProps = {
  items?: HubListMockItem[];
};

export function HubListWidget({ items = MOCK_HUB_LIST_ITEMS }: HubListWidgetProps): ReactElement {
  const [addItemModalKey, setAddItemModalKey] = useState(0);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const { active, claimed, purchased } = partitionHubListItems(items);

  const hasActive = active.length > 0;
  const hasClaimed = claimed.length > 0;
  const hasPurchased = purchased.length > 0;
  const isEmpty = items.length === 0;

  return (
    <Box
      as="section"
      aria-label="Hub shopping list"
      display="flex"
      flexDirection="column"
      h="380px"
      w="full"
      maxW="full"
      minW="0"
      bg="bg.primary"
      borderWidth="1px"
      borderColor="border.primary"
      borderRadius="l2"
      overflow="hidden"
      px="4"
      pt="4"
      pb="0"
    >
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
        {isEmpty ? (
          <HubListWidgetEmptyState />
        ) : (
          <Stack gap="0" w="full" pb="4">
            {hasActive ? (
              <Stack gap="0" w="full">
                {active.map((item, index) => (
                  <HubListWidgetItem
                    key={item.id}
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
    </Box>
  );
}
