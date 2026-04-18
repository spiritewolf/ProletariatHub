import { Box, Flex, HStack, IconButton, Text, useDisclosure } from '@chakra-ui/react';
import { HubListItemStatus, type HubListItem } from '@proletariat-hub/types';
import { Trash2 } from 'lucide-react';
import type { ReactElement } from 'react';

import { ComradeAssigneeBadge } from './ComradeAssigneeBadge';
import { HubListCheckbox } from './HubListCheckbox';
import { PriorityBadge } from './PriorityBadge';
import { RemoveListItemDialog } from './RemoveListItemDialog';

type HubListWidgetItemProps = {
  hubListId: string;
  item: HubListItem;
  isLastRowInSection: boolean;
};

export function HubListWidgetItem({
  hubListId,
  item,
  isLastRowInSection,
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
        <HubListCheckbox displayStatus={item.status} />
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
              <ComradeAssigneeBadge
                displayInitial={item.claimedBy.displayInitial}
                username={item.claimedBy.username}
              />
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
