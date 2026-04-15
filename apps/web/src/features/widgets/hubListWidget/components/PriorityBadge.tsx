import { Box } from '@chakra-ui/react';
import type { ReactElement } from 'react';

import type { HubListPriority } from '../mockData';
import { PRIORITY_CONFIG } from '../mockData';

type PriorityBadgeProps = {
  priority: HubListPriority;
};

export function PriorityBadge({ priority }: PriorityBadgeProps): ReactElement {
  const { bg, color } = PRIORITY_CONFIG[priority];
  return (
    <Box
      as="span"
      borderRadius="full"
      px="2"
      py="0.5"
      fontSize="xs"
      fontWeight="medium"
      flexShrink={0}
      bg={bg}
      color={color}
      textTransform="uppercase"
      letterSpacing="0.06em"
    >
      {priority}
    </Box>
  );
}
