import { Box } from '@chakra-ui/react';
import type { DashboardShoppingItemWidget } from '@proletariat-hub/contracts';

import { formatShoppingWidgetRowMeta } from '../../../features/shopping/shoppingDisplay';
import { dashboardTheme } from '../../../styles/dashboardTheme';
import { DashboardPriorityBadge } from '../../ui/DashboardPriorityBadge';
import { ListItemRow } from '../shared/ListItemRow';

type ShoppingListItemProps = {
  item: DashboardShoppingItemWidget;
};

export function ShoppingListItem({ item }: ShoppingListItemProps): React.ReactElement {
  return (
    <ListItemRow
      leading={
        <Box
          borderRadius="full"
          borderWidth="1px"
          borderColor={dashboardTheme.cardBorder}
          w="12px"
          h="12px"
        />
      }
      title={item.name}
      meta={formatShoppingWidgetRowMeta(item)}
      trailing={
        <>
          <DashboardPriorityBadge priority={item.priority} />
        </>
      }
    />
  );
}
