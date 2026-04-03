import { Text } from '@chakra-ui/react';

import { dashboardTheme } from '../../../styles/dashboardTheme';

type ShoppingListHeaderProps = {
  category: string;
};

export function ShoppingListHeader({ category }: ShoppingListHeaderProps): React.ReactElement {
  return (
    <Text
      fontSize="8px"
      fontWeight="bold"
      color={dashboardTheme.title}
      letterSpacing="0.08em"
      mb={1}
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="ellipsis"
    >
      ★ {category.toUpperCase()}
    </Text>
  );
}
