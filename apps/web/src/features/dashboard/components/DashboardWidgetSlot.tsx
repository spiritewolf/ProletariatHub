import { GridItem } from '@chakra-ui/react';
import type { ReactElement, ReactNode } from 'react';

export type DashboardWidgetSlotProps = {
  lgColStart: number;
  lgColSpan: number;
  lgRowStart: number;
  lgRowSpan?: number;
  children: ReactNode;
};

export function DashboardWidgetSlot({
  lgColStart,
  lgColSpan,
  lgRowStart,
  lgRowSpan = 1,
  children,
}: DashboardWidgetSlotProps): ReactElement {
  return (
    <GridItem
      minH={{ base: '36', md: '36', lg: '0' }}
      h={{ lg: 'full' }}
      minW="0"
      colSpan={{ base: 1, md: 1, lg: lgColSpan }}
      rowSpan={{ lg: lgRowSpan }}
      colStart={{ lg: lgColStart }}
      rowStart={{ lg: lgRowStart }}
    >
      {children}
    </GridItem>
  );
}
