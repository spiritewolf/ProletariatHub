import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import type { HubListItem } from '@proletariat-hub/types';
import type { ReactElement } from 'react';

import { HubListItemDisplayStatus } from '../types';
import { ComradeAssigneeBadge } from './ComradeAssigneeBadge';
import { HubListCheckbox } from './HubListCheckbox';
import { PriorityBadge } from './PriorityBadge';

type HubListWidgetItemProps = {
  item: HubListItem;
  displayStatus: HubListItemDisplayStatus;
  isLastRowInSection: boolean;
};

export function HubListWidgetItem({
  item,
  displayStatus,
  isLastRowInSection,
}: HubListWidgetItemProps): ReactElement {
  const isPurchased = displayStatus === HubListItemDisplayStatus.PURCHASED;
  const isClaimed = displayStatus === HubListItemDisplayStatus.CLAIMED;

  return (
    <Box
      w="full"
      bg={isClaimed ? 'bg.secondary' : undefined}
      opacity={isPurchased ? 0.45 : undefined}
      borderBottomWidth={isLastRowInSection ? undefined : '1px'}
      borderColor={isLastRowInSection ? undefined : 'hubList.border'}
    >
      <Flex align="center" gap="3" py="2.5" px="2" w="full" minW="0">
        <HubListCheckbox displayStatus={displayStatus} />
        <HStack flex="1" minW="0" gap="2" align="center" justify="space-between">
          <HStack flex="1" minW="0" gap="0" align="baseline" flexWrap="wrap">
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
                <Text as="span" fontSize="xs" color="text.secondary" ml="1"></Text>
                <Text as="span" fontSize="xs" color="text.secondary">
                  {item.productBrand}
                </Text>
              </>
            ) : null}
            {item.vendorName !== null ? (
              <>
                <Text as="span" fontSize="xs" color="text.secondary" ml="1"></Text>
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
          </HStack>
        </HStack>
      </Flex>
    </Box>
  );
}
