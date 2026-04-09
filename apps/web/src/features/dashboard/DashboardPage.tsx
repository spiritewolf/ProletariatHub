import { Box, Grid } from '@chakra-ui/react';
import { DashboardWidgetSlot } from '@proletariat-hub/web/features/dashboard/components/DashboardWidgetSlot';
import { WidgetCard } from '@proletariat-hub/web/features/dashboard/components/WidgetCard';
import type { ReactElement } from 'react';

export function DashboardPage(): ReactElement {
  return (
    <Box
      flex="1"
      minH="0"
      display="flex"
      flexDirection="column"
      w="100%"
      h={{ lg: 'full' }}
    >
      <Grid
        flex="1"
        minH="0"
        h={{ lg: 'full' }}
        w="100%"
        gap={{ base: '4', md: '4', lg: '10' }}
        px={{ base: '4', md: '6' }}
        py="4"
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(8, 1fr)' }}
        templateRows={{ lg: 'repeat(4, minmax(0, 1fr))' }}
        autoRows={{ base: 'minmax(9rem, auto)', md: 'minmax(9rem, auto)' }}
        overflowY={{ lg: 'auto' }}
      >
        <DashboardWidgetSlot lgColumn="1 / span 5" lgRow="1">
          <WidgetCard />
        </DashboardWidgetSlot>
        <DashboardWidgetSlot lgColumn="6 / span 3" lgRow="1">
          <WidgetCard />
        </DashboardWidgetSlot>
        <DashboardWidgetSlot lgColumn="1 / span 4" lgRow="2">
          <WidgetCard />
        </DashboardWidgetSlot>
        <DashboardWidgetSlot lgColumn="5 / span 4" lgRow="2">
          <WidgetCard />
        </DashboardWidgetSlot>
        <DashboardWidgetSlot lgColumn="1 / span 2" lgRow="3">
          <WidgetCard />
        </DashboardWidgetSlot>
        <DashboardWidgetSlot lgColumn="3 / span 4" lgRow="3">
          <WidgetCard />
        </DashboardWidgetSlot>
        <DashboardWidgetSlot lgColumn="7 / span 2" lgRow="3">
          <WidgetCard />
        </DashboardWidgetSlot>
        <DashboardWidgetSlot lgColumn="1 / span 8" lgRow="4">
          <WidgetCard />
        </DashboardWidgetSlot>
      </Grid>
    </Box>
  );
}
