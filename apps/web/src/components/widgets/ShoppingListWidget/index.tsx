import { Box } from '@chakra-ui/react';

import { MutedCaption } from '../../../components/ui/MutedCaption';
import { DashboardCopy } from '../../../features/dashboard/dashboardCopy';
import { groupDashboardShoppingItemsByCategory } from '../../../features/shopping/shoppingDisplay';
import { dashboardTheme } from '../../../styles/dashboardTheme';
import { ShoppingCategoryGroup } from './ShoppingCategoryGroup';
import { ShoppingListItem } from './ShoppingListItem';
import type { ShoppingListWidgetProps } from './ShoppingListWidget.types';

export function ShoppingListWidget({
  items,
  emptyText = DashboardCopy.shoppingEmpty,
  mode = 'grouped',
}: ShoppingListWidgetProps): React.ReactElement {
  if (items.length === 0) {
    return <MutedCaption text={emptyText} mutedColor={dashboardTheme.meta} />;
  }

  if (mode === 'flat') {
    return (
      <Box>
        {items.map((item) => (
          <ShoppingListItem key={item.id} item={item} />
        ))}
      </Box>
    );
  }

  const categoryGroups = groupDashboardShoppingItemsByCategory(items);
  return (
    <Box>
      {categoryGroups.map((group) => (
        <ShoppingCategoryGroup key={group.category} group={group} />
      ))}
    </Box>
  );
}
