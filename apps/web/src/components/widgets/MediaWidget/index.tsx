import { Grid, Text } from '@chakra-ui/react';

import { DashboardCopy } from '../../../features/dashboard/dashboardCopy';
import { dashboardTheme } from '../../../styles/dashboardTheme';
import { MediaTile } from './MediaTile';
import type { MediaWidgetProps } from './MediaWidget.types';

export function MediaWidget({ tiles, isLoading }: MediaWidgetProps): React.ReactElement {
  if (isLoading) {
    return (
      <Text fontSize="9px" color={dashboardTheme.meta}>
        {DashboardCopy.loading}
      </Text>
    );
  }

  if ((tiles ?? []).length === 0) {
    return (
      <Text fontSize="9px" color={dashboardTheme.meta}>
        {DashboardCopy.mediaServicesEmpty}
      </Text>
    );
  }

  return (
    <Grid templateColumns="1fr 1fr" gap={2}>
      {(tiles ?? []).map((tile) => (
        <MediaTile key={tile.id} tile={tile} />
      ))}
    </Grid>
  );
}
