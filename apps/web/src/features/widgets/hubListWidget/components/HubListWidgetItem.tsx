import { Box, Button, Dialog, Flex, HStack, IconButton, Text } from '@chakra-ui/react';
import type { HubListItem } from '@proletariat-hub/types';
import { useRemoveOneListItem } from '@proletariat-hub/web/shared/trpc';
import { toaster } from '@proletariat-hub/web/shared/ui';
import { Trash2 } from 'lucide-react';
import type { ReactElement } from 'react';
import { useState } from 'react';

import { HubListItemDisplayStatus } from '../types';
import { ComradeAssigneeBadge } from './ComradeAssigneeBadge';
import { HubListCheckbox } from './HubListCheckbox';
import { PriorityBadge } from './PriorityBadge';

type HubListWidgetItemProps = {
  hubListId: string;
  item: HubListItem;
  displayStatus: HubListItemDisplayStatus;
  isLastRowInSection: boolean;
};

export function HubListWidgetItem({
  hubListId,
  item,
  displayStatus,
  isLastRowInSection,
}: HubListWidgetItemProps): ReactElement {
  const isPurchased = displayStatus === HubListItemDisplayStatus.PURCHASED;
  const isClaimed = displayStatus === HubListItemDisplayStatus.CLAIMED;
  const [itemPendingRemove, setItemPendingRemove] = useState<HubListItem | null>(null);

  const removeListItem = useRemoveOneListItem({
    onSuccess: () => {
      toaster.create({
        type: 'success',
        title: 'Removed from list',
      });
      setItemPendingRemove(null);
    },
    onError: (error) => {
      toaster.create({
        type: 'error',
        title: error.message,
      });
    },
  });

  const showListQuantity = item.quantity !== null && item.quantity > 0;

  return (
    <Box
      role="group"
      w="full"
      bg={isClaimed ? 'bg.secondary' : undefined}
      opacity={isPurchased ? 0.45 : undefined}
      borderBottomWidth={isLastRowInSection ? undefined : '1px'}
      borderColor={isLastRowInSection ? undefined : 'hubList.border'}
    >
      <Flex align="center" gap="3" py="2.5" px="2" w="full" minW="0">
        <HubListCheckbox displayStatus={displayStatus} />
        <HStack flex="1" minW="0" gap="2" align="center" justify="space-between">
          <HStack flex="1" minW="0" gap="2" align="baseline" flexWrap="wrap">
            {showListQuantity ? (
              <Text
                as="span"
                fontSize="xs"
                fontWeight="medium"
                color="text.secondary"
                flexShrink={0}
              >
                {item.quantity}x
              </Text>
            ) : null}
            <Text
              as="span"
              fontSize="sm"
              fontWeight="medium"
              color={isPurchased ? 'text.secondary' : 'text.primary'}
              lineHeight="short"
              textDecoration={isPurchased ? 'line-through' : undefined}
            >
              {item.productName}
            </Text>
            {item.productBrand !== null ? (
              <>
                <Text as="span" fontSize="xs" color="text.secondary" aria-hidden>
                  ·
                </Text>
                <Text as="span" fontSize="xs" color="text.secondary">
                  {item.productBrand}
                </Text>
              </>
            ) : null}
            {item.vendorName !== null ? (
              <>
                <Text as="span" fontSize="xs" color="text.secondary" aria-hidden>
                  ·
                </Text>
                <Text as="span" fontSize="xs" color="text.secondary">
                  {item.vendorName}
                </Text>
              </>
            ) : null}
          </HStack>
          <HStack gap="2" flexShrink={0} justify="flex-end">
            {displayStatus === HubListItemDisplayStatus.ACTIVE ? (
              <PriorityBadge priority={item.priority} />
            ) : null}
            {displayStatus !== HubListItemDisplayStatus.ACTIVE && item.claimedBy !== null ? (
              <ComradeAssigneeBadge
                displayInitial={item.claimedBy.displayInitial}
                username={item.claimedBy.username}
              />
            ) : null}
            {displayStatus === HubListItemDisplayStatus.ACTIVE ? (
              <IconButton
                type="button"
                aria-label={`Remove ${item.productName} from list`}
                variant="ghost"
                size="xs"
                colorPalette="gray"
                opacity={{ base: 1, md: 0 }}
                _groupHover={{ opacity: 1 }}
                onClick={() => {
                  setItemPendingRemove(item);
                }}
              >
                <Trash2 size={16} strokeWidth={2} aria-hidden />
              </IconButton>
            ) : null}
          </HStack>
        </HStack>
      </Flex>

      <Dialog.Root
        open={itemPendingRemove !== null}
        onOpenChange={(details) => {
          if (!details.open) {
            setItemPendingRemove(null);
          }
        }}
        role="alertdialog"
      >
        <Dialog.Backdrop bg="blackAlpha.600" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="sm"
            bg="bg.primary"
            borderRadius="l2"
            borderWidth="1px"
            borderColor="border.primary"
          >
            <Dialog.Header>
              <Dialog.Title>Remove from list?</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text fontSize="sm" color="text.secondary">
                Remove {itemPendingRemove?.productName ?? 'this item'} from the hub list?
              </Text>
            </Dialog.Body>
            <Dialog.Footer gap="2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setItemPendingRemove(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                colorPalette="red"
                loading={removeListItem.isPending}
                onClick={() => {
                  if (itemPendingRemove === null) {
                    return;
                  }
                  removeListItem.mutate({ hubListItemId: itemPendingRemove.id, hubListId });
                }}
              >
                Remove
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
}
