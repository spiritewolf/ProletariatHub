import { Box, Flex, HStack, IconButton, Text, useDisclosure } from '@chakra-ui/react';
import { type HubListItem, HubListItemStatus } from '@proletariat-hub/types';
import { Trash2 } from 'lucide-react';
import { DateTime } from 'luxon';
import type { ReactElement } from 'react';

import { HubListCheckbox } from './HubListCheckbox';
import { PriorityBadge } from './PriorityBadge';
import { RemoveListItemDialog } from './RemoveListItemDialog';

type HubListWidgetItemProps = {
  hubListId: string;
  item: HubListItem;
  isLastRowInSection: boolean;
  itemSelection?: { isSelected: boolean; onToggle: () => void };
};

export function formatClaimedAtDate(date: Date): string {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return DateTime.fromJSDate(date).setZone(timeZone).toFormat('MMM d, yyyy @ h:mma');
}

export function HubListWidgetItem({
  hubListId,
  item,
  isLastRowInSection,
  itemSelection,
}: HubListWidgetItemProps): ReactElement {
  const isPurchased = item.status === HubListItemStatus.PURCHASED;
  const isClaimed = item.status === HubListItemStatus.CLAIMED;
  const removeListItemModal = useDisclosure();

  const showListQuantity = item.quantity && item.quantity > 0;

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
        <HubListCheckbox
          status={item.status}
          isSelected={itemSelection?.isSelected}
          onToggle={itemSelection?.onToggle}
        />
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
            {item.productBrand ? (
              <Text as="span" fontSize="xs" color="text.secondary">
                {item.productBrand}
              </Text>
            ) : null}
            {item.vendorName ? (
              <Text as="span" fontSize="xs" color="text.secondary">
                {item.vendorName}
              </Text>
            ) : null}
          </HStack>
          <HStack gap="2" flexShrink={0} justify="flex-end">
            {item.status === HubListItemStatus.ACTIVE ? (
              <PriorityBadge priority={item.priority} />
            ) : null}
            {item.status === HubListItemStatus.CLAIMED && item.claimedBy ? (
              <HStack gap="2">
                <Flex
                  w="4.5"
                  h="4.5"
                  borderRadius="full"
                  bg="accent.secondary"
                  color="text.light"
                  align="center"
                  justify="center"
                  fontSize="2xs"
                  fontWeight="medium"
                  flexShrink={0}
                  aria-hidden
                >
                  {item.claimedBy.displayInitial}
                </Flex>
                <Text fontSize="xs" color="text.secondary" maxW="24" lineClamp={1}>
                  {item.claimedBy.username}
                </Text>
                {item.claimedAt ? (
                  <Text fontSize="xs" color="text.secondary">
                    {formatClaimedAtDate(item.claimedAt)}
                  </Text>
                ) : null}
              </HStack>
            ) : null}
            {item.status === HubListItemStatus.ACTIVE ? (
              <IconButton
                type="button"
                aria-label={`Remove ${item.productName} from list`}
                variant="ghost"
                size="xs"
                colorPalette="error"
                onClick={removeListItemModal.onOpen}
              >
                <Box
                  as="span"
                  display="inline-flex"
                  alignItems="center"
                  justifyContent="center"
                  color="error.fg"
                  lineHeight={0}
                >
                  <Trash2 size={16} strokeWidth={2} aria-hidden />
                </Box>
              </IconButton>
            ) : null}
          </HStack>
        </HStack>
      </Flex>

      <RemoveListItemDialog
        hubListId={hubListId}
        hubListItem={item}
        onClose={removeListItemModal.onClose}
        isOpen={removeListItemModal.open}
      />
    </Box>
  );
}
