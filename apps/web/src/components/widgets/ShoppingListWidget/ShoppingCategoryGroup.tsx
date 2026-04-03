import { Box } from '@chakra-ui/react';

import { ShoppingListHeader } from './ShoppingListHeader';
import { ShoppingListItem } from './ShoppingListItem';
import type { ShoppingCategoryGroupModel } from './ShoppingListWidget.types';

type ShoppingCategoryGroupProps = {
  group: ShoppingCategoryGroupModel;
};

export function ShoppingCategoryGroup({ group }: ShoppingCategoryGroupProps): React.ReactElement {
  return (
    <Box mb={2}>
      <ShoppingListHeader category={group.category} />
      {group.items.map((item) => (
        <ShoppingListItem key={item.id} item={item} />
      ))}
    </Box>
  );
}
