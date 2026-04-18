import { Box, Center, Spinner, Stack, useDisclosure } from '@chakra-ui/react';
import { HubListItemStatus } from '@proletariat-hub/types';
import { useFindUniqueHubList } from '@proletariat-hub/web/shared/trpc/queries';
import type { ReactElement } from 'react';

import { AddItemModal } from './addItemModal/AddItemModal';
import { HubListWidgetEmptyState } from './components/HubListWidgetEmptyState';
import { HubListWidgetHeader } from './components/HubListWidgetHeader';
import { HubListWidgetItem } from './components/HubListWidgetItem';
import { HubListWidgetSection } from './components/HubListWidgetSection';
import { HubListWidgetWrapper } from './componentstwo/HubListWidgetWrapper';

export function HubListWidget(): ReactElement {
  const addListItemModal = useDisclosure();
  const { data: hubList, isLoading } = useFindUniqueHubList();
  const listItems = hubList.items;

  const activeListItems = listItems.filter((item) => item.status === HubListItemStatus.ACTIVE);
  const claimedListItems = listItems.filter((item) => item.status === HubListItemStatus.CLAIMED);
  const purchasedListItems = listItems.filter(
    (item) => item.status === HubListItemStatus.PURCHASED,
  );

  const isEmpty = listItems.length === 0;

  return (
    <HubListWidgetWrapper>
      <HubListWidgetHeader
        activeCount={activeListItems.length}
        onAddClick={() => {
          addListItemModal.onOpen();
        }}
      />
      <AddItemModal isOpen={addListItemModal.open} onClose={addListItemModal.onClose} />
      <Box flex="1" minH="0" overflowY="auto" py="2">
        <Stack gap="0" w="full" pb="4">
          {isLoading ? (
            <Center py="12">
              <Spinner size="lg" color="accent.primary" />
            </Center>
          ) : null}{' '}
          {isEmpty ? <HubListWidgetEmptyState /> : null}
          {activeListItems.length > 0 ? (
            <Stack gap="0" w="full">
              {activeListItems.map((item, index) => (
                <HubListWidgetItem
                  key={item.id}
                  hubListId={hubList.id}
                  item={item}
                  isLastRowInSection={index === activeListItems.length - 1}
                />
              ))}
            </Stack>
          ) : null}
          {claimedListItems.length > 0 ? (
            <HubListWidgetSection dividerLabel="Claimed">
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
            <HubListWidgetSection dividerLabel="Recently purchased">
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
