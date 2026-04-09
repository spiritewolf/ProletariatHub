import { Box, Grid } from '@chakra-ui/react';
import { DashboardWidgetSlot } from '@proletariat-hub/web/features/dashboard/components/DashboardWidgetSlot';
import { WidgetCard } from '@proletariat-hub/web/features/dashboard/components/WidgetCard';
import type { ReactElement } from 'react';

export function DashboardPage(): ReactElement {
  return (
    <Grid
      flex="1"
      minH="0"
      h={{ lg: 'full' }}
      w="100%"
      gap={{ base: '4', md: '4', lg: '4' }}
      px={{ base: '4', md: '6' }}
      py="4"
      bg="pink"
      // templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(8, 1fr)' }}
      // templateRows={{ lg: 'repeat(4, minmax(0, 1fr))' }}
      // autoRows={{ base: 'minmax(9rem, auto)', md: 'minmax(9rem, auto)' }}
      // overflowY={{ lg: 'auto' }}
    >
      <DashboardWidgetSlot lgColStart={1} lgColSpan={5} lgRowStart={1}>
        <WidgetCard />
      </DashboardWidgetSlot>
      <DashboardWidgetSlot lgColStart={6} lgColSpan={3} lgRowStart={1}>
        <WidgetCard />
      </DashboardWidgetSlot>
      <DashboardWidgetSlot lgColStart={1} lgColSpan={4} lgRowStart={2}>
        <WidgetCard />
      </DashboardWidgetSlot>
      <DashboardWidgetSlot lgColStart={5} lgColSpan={4} lgRowStart={2}>
        <WidgetCard />
      </DashboardWidgetSlot>
      <DashboardWidgetSlot lgColStart={1} lgColSpan={2} lgRowStart={3}>
        <WidgetCard />
      </DashboardWidgetSlot>
      <DashboardWidgetSlot lgColStart={3} lgColSpan={4} lgRowStart={3}>
        <WidgetCard />
      </DashboardWidgetSlot>
      <DashboardWidgetSlot lgColStart={7} lgColSpan={2} lgRowStart={3}>
        <WidgetCard />
      </DashboardWidgetSlot>
      <DashboardWidgetSlot lgColStart={1} lgColSpan={8} lgRowStart={4}>
        <WidgetCard />
      </DashboardWidgetSlot>
    </Grid>
  );
}
