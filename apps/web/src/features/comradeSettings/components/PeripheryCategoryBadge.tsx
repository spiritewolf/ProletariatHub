import { Box } from '@chakra-ui/react';
import type { HubPeripheryCategory } from '@proletariat-hub/types';
import { HubPeripheryCategory as HubPeripheryCategoryConst } from '@proletariat-hub/types';
import type { ReactElement } from 'react';

type PeripheryCategoryBadgeProps = {
  category: HubPeripheryCategory;
};

export function PeripheryCategoryBadge({ category }: PeripheryCategoryBadgeProps): ReactElement {
  const isCategoryPet = category === HubPeripheryCategoryConst.PET;
  return (
    <Box
      as="span"
      borderRadius="full"
      px="2.5"
      py="0.5"
      fontSize="xs"
      fontWeight="medium"
      flexShrink={0}
      bg={isCategoryPet ? 'accent.secondary' : 'bg.secondary'}
      color={isCategoryPet ? 'text.light' : 'text.secondary'}
    >
      {isCategoryPet ? 'Pet' : 'Person'}
    </Box>
  );
}
