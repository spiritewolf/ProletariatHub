import { Card, Grid, GridItem, Stack, Text } from '@chakra-ui/react';
import { WidgetWrapper } from '@proletariat-hub/web/shared/ui';
import type { ReactElement } from 'react';

export function Dashboard(): ReactElement {
  return (
    <Stack flex="1" h="full" p="4" overflowY="scroll">
      <Grid
        flex="1"
        h="full"
        templateRows="repeat(8, 1fr)"
        templateColumns="repeat(6, 1fr)"
        gap="4"
      >
        <GridItem rowSpan={{ base: 1, md: 1, lg: 4 }} colSpan={{ base: 1, md: 1, lg: 4 }}>
          <Card.Root variant="outline" w="full" h="full">
            <Stack p={4}>
              <Text>Hub Lists</Text>
            </Stack>
          </Card.Root>
        </GridItem>
        <GridItem rowSpan={{ base: 1, md: 1, lg: 4 }} colSpan={{ base: 1, md: 1, lg: 2 }}>
          <WidgetWrapper>
            <Text>Urgent Items</Text>
          </WidgetWrapper>
        </GridItem>

        <GridItem rowSpan={{ base: 1, md: 1, lg: 2 }} colSpan={{ base: 1, md: 1, lg: 3 }}>
          <WidgetWrapper>
            <Text>Contributions</Text>
          </WidgetWrapper>
        </GridItem>
        <GridItem rowSpan={{ base: 1, md: 1, lg: 2 }} colSpan={{ base: 1, md: 1, lg: 3 }}>
          <WidgetWrapper>
            <Text>Tasks</Text>
          </WidgetWrapper>
        </GridItem>

        <GridItem rowSpan={{ base: 1, md: 1, lg: 2 }} colSpan={{ base: 1, md: 1, lg: 2 }}>
          <WidgetWrapper>
            <Text>Calendar Reminders</Text>
          </WidgetWrapper>
        </GridItem>
        <GridItem rowSpan={{ base: 1, md: 1, lg: 2 }} colSpan={{ base: 1, md: 1, lg: 2 }}>
          <WidgetWrapper>
            <Text>Media Services</Text>
          </WidgetWrapper>
        </GridItem>
        <GridItem rowSpan={{ base: 1, md: 1, lg: 2 }} colSpan={{ base: 1, md: 1, lg: 2 }}>
          <WidgetWrapper>
            <Text>Documentation</Text>
          </WidgetWrapper>
        </GridItem>

        <GridItem rowSpan={{ base: 1, md: 1, lg: 2 }} colSpan={{ base: 1, md: 1, lg: 6 }}>
          <WidgetWrapper>
            <Text>Comrades</Text>
          </WidgetWrapper>
        </GridItem>
      </Grid>
    </Stack>
  );
}
