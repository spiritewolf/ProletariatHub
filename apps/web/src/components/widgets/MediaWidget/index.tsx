import { Grid, Text } from '@chakra-ui/react';

import { DashboardCopy } from '../../../features/dashboard/dashboardCopy';
import { useServiceTiles } from '../../../features/media/useServiceTiles';
import { dashboardTheme } from '../../../styles/dashboardTheme';
import { MediaTile } from './MediaTile';

export function MediaWidget(): React.ReactElement {
  const tilesQuery = useServiceTiles();

  if (tilesQuery.isLoading) {
    return (
      <Text fontSize="9px" color={dashboardTheme.meta}>
        {DashboardCopy.loading}
      </Text>
    );
  }

  if ((tilesQuery.data ?? []).length === 0) {
    return (
      <Text fontSize="9px" color={dashboardTheme.meta}>
        {DashboardCopy.mediaServicesEmpty}
      </Text>
    );
  }

  return (
    <Grid templateColumns="1fr 1fr" gap={2}>
      {(tilesQuery.data ?? []).map((tile) => (
        <MediaTile key={tile.id} tile={tile} />
      ))}
    </Grid>
  );
}
