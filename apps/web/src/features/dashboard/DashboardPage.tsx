import { Button, Card, Grid, GridItem, Stack, Text } from '@chakra-ui/react';
import { WidgetCard } from '@proletariat-hub/web/features/dashboard/components/WidgetCard';
import type { ReactElement } from 'react';

export function DashboardPage(): ReactElement {
  return (
    <Stack flex="1" h="full" p="4" overflowY="scroll">
      <Grid
        flex="1"
        h="full"
        templateRows="repeat(8, 1fr)"
        templateColumns="repeat(8, 1fr)"
        gap="4"
      >
        <GridItem rowSpan={{ base: 1, md: 1, lg: 4 }} colSpan={{ base: 1, md: 1, lg: 5 }}>
          <Card.Root variant="outline" w="full" h="full">
            <Stack p={4}>
              <Text>Widget Card</Text>
              <Button variant="solid" colorPalette="brandPalette">
                Click
              </Button>
            </Stack>
          </Card.Root>
        </GridItem>
        <GridItem rowSpan={{ base: 1, md: 1, lg: 4 }} colSpan={{ base: 1, md: 1, lg: 3 }}>
          <WidgetCard />
        </GridItem>

        <GridItem rowSpan={{ base: 1, md: 1, lg: 2 }} colSpan={{ base: 1, md: 1, lg: 4 }}>
          <WidgetCard />
        </GridItem>
        <GridItem rowSpan={{ base: 1, md: 1, lg: 2 }} colSpan={{ base: 1, md: 1, lg: 4 }}>
          <WidgetCard />
        </GridItem>

        <GridItem rowSpan={{ base: 1, md: 1, lg: 2 }} colSpan={{ base: 1, md: 1, lg: 2 }}>
          <WidgetCard />
        </GridItem>
        <GridItem rowSpan={{ base: 1, md: 1, lg: 2 }} colSpan={{ base: 1, md: 1, lg: 2 }}>
          <WidgetCard />
        </GridItem>
        <GridItem rowSpan={{ base: 1, md: 1, lg: 2 }} colSpan={{ base: 1, md: 1, lg: 4 }}>
          <WidgetCard />
        </GridItem>
      </Grid>
    </Stack>
  );
}
