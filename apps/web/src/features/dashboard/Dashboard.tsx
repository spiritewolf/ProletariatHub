import { Grid, GridItem, Stack, Text } from '@chakra-ui/react';
import { HubListWidget } from '@proletariat-hub/web/features/widgets';
import { WidgetWrapper } from '@proletariat-hub/web/shared/ui';
import type { ReactElement } from 'react';

export function Dashboard(): ReactElement {
  return (
    <Stack w="full" p="4">
      <Grid
        w="full"
        templateColumns={{ base: '1fr', lg: 'repeat(3, minmax(0, 1fr))' }}
        gridAutoRows="auto"
        gap="4"
        alignItems="start"
      >
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <HubListWidget />
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 1 }}>
          <WidgetWrapper>
            <Text>Urgent Items</Text>
          </WidgetWrapper>
        </GridItem>

        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <WidgetWrapper>
            <Text>Contributions</Text>
          </WidgetWrapper>
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 1 }}>
          <WidgetWrapper>
            <Text>Tasks</Text>
          </WidgetWrapper>
        </GridItem>

        <GridItem colSpan={1}>
          <WidgetWrapper>
            <Text>Calendar Reminders</Text>
          </WidgetWrapper>
        </GridItem>
        <GridItem colSpan={1}>
          <WidgetWrapper>
            <Text>Media Services</Text>
          </WidgetWrapper>
        </GridItem>
        <GridItem colSpan={1}>
          <WidgetWrapper>
            <Text>Documentation</Text>
          </WidgetWrapper>
        </GridItem>

        <GridItem colSpan={{ base: 1, lg: 3 }}>
          <WidgetWrapper>
            <Text>Comrades</Text>
          </WidgetWrapper>
        </GridItem>
      </Grid>
    </Stack>
  );
}
