import { Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import { dashboardTheme } from '../../dashboardTheme';
import { DashboardCopy } from '../../utils/dashboardCopy';
import { MEDIA_SERVICE_DISPLAY_LABEL, MEDIA_SERVICE_ROW_ORDER } from '../../utils/mediaServices';

export function DashboardMediaServicesGrid() {
  return (
    <Grid templateColumns="1fr 1fr" gap={2}>
      {MEDIA_SERVICE_ROW_ORDER.map((serviceId) => (
        <GridItem key={serviceId}>
          <Flex
            direction="column"
            align="center"
            justify="center"
            borderWidth="1px"
            borderColor={dashboardTheme.cardBorder}
            borderRadius="md"
            minH="56px"
            gap={1}
          >
            <Text fontSize="10px" fontWeight="semibold" color={dashboardTheme.text}>
              {MEDIA_SERVICE_DISPLAY_LABEL[serviceId]}
            </Text>
            <Text fontSize="8px" color={dashboardTheme.meta}>
              {DashboardCopy.mediaServiceKindLabel}
            </Text>
          </Flex>
        </GridItem>
      ))}
    </Grid>
  );
}
