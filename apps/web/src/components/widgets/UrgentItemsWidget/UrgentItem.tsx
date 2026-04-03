import { Box, Text } from '@chakra-ui/react';
import type { DashboardShoppingItemWidget } from '@proletariat-hub/contracts';

import { DashboardCopy } from '../../../features/dashboard/dashboardCopy';
import {
  DASHBOARD_SHOPPING_KIND_BADGE_BG,
  DASHBOARD_SHOPPING_KIND_BADGE_COLOR,
  DASHBOARD_URGENT_ITEM_DOT_COLOR,
} from '../../../features/dashboard/dashboardUiTokens';
import { DashboardPriorityBadge } from '../../ui/DashboardPriorityBadge';
import { ListItemRow } from '../shared/ListItemRow';

type UrgentItemProps = {
  item: DashboardShoppingItemWidget;
};

export function UrgentItem({ item }: UrgentItemProps): React.ReactElement {
  return (
    <ListItemRow
      leading={
        <Box
          w="10px"
          h="10px"
          borderRadius="full"
          bg={DASHBOARD_URGENT_ITEM_DOT_COLOR}
          flexShrink={0}
        />
      }
      title={item.name}
      meta={item.listName}
      trailing={
        <>
          <Text
            as="span"
            fontSize="8px"
            bg={DASHBOARD_SHOPPING_KIND_BADGE_BG}
            color={DASHBOARD_SHOPPING_KIND_BADGE_COLOR}
            px={1}
            py={0.5}
            borderRadius="sm"
            whiteSpace="nowrap"
          >
            {DashboardCopy.shoppingKindBadge}
          </Text>
          <DashboardPriorityBadge priority={item.priority} />
        </>
      }
    />
  );
}
