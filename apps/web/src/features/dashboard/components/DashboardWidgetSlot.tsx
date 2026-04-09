import { Box } from '@chakra-ui/react';
import type { ReactElement, ReactNode } from 'react';

export type DashboardWidgetSlotProps = {
  lgColumn: string;
  lgRow: string;
  children: ReactNode;
};

export function DashboardWidgetSlot({
  lgColumn,
  lgRow,
  children,
}: DashboardWidgetSlotProps): ReactElement {
  return (
    <Box
      minH={{ base: '36', md: '36', lg: '0' }}
      h={{ lg: 'full' }}
      minW="0"
      gridColumn={{
        base: '1 / -1',
        md: 'span 1',
        lg: lgColumn,
      }}
      gridRow={{ lg: lgRow }}
    >
      {children}
    </Box>
  );
}
