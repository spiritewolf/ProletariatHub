import { Text } from '@chakra-ui/react';
import type { DashboardShoppingItemWidget } from '@proletariat-hub/contracts';
import {
  getShoppingPriorityBadgeStyles,
  getShoppingPriorityBadgeText,
} from '../utils/shoppingPriorityDisplay';

type DashboardPriorityBadgeProps = {
  priority: DashboardShoppingItemWidget['priority'];
};

export function DashboardPriorityBadge({ priority }: DashboardPriorityBadgeProps) {
  const styles = getShoppingPriorityBadgeStyles(priority);
  const label = getShoppingPriorityBadgeText(priority);
  return (
    <Text
      as="span"
      fontSize="8px"
      fontWeight="bold"
      textTransform="uppercase"
      px={1.5}
      py={0.5}
      borderRadius="sm"
      {...styles}
      whiteSpace="nowrap"
    >
      {label}
    </Text>
  );
}
