import { Grid, GridItem, Link, Text } from '@chakra-ui/react';
import { serviceTilesListResponseSchema } from '@proletariat-hub/contracts';
import { useQuery } from '@tanstack/react-query';

import { apiJsonValidated } from '../../../api';
import { DocsApiPaths } from '../../../pages/docs/docsApiPaths';
import { docsQueryKeys } from '../../../pages/docs/docsQueryKeys';
import { dashboardTheme } from '../../dashboardTheme';
import { DashboardCopy } from '../../utils/dashboardCopy';

export function DashboardMediaServicesGrid() {
  const tilesQuery = useQuery({
    queryKey: docsQueryKeys.serviceTiles,
    queryFn: async () => {
      const data = await apiJsonValidated(
        DocsApiPaths.serviceTiles,
        serviceTilesListResponseSchema,
      );
      return data.serviceTiles;
    },
  });

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
        <GridItem key={tile.id}>
          <Link
            href={tile.url}
            target="_blank"
            rel="noreferrer"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            borderWidth="1px"
            borderColor={dashboardTheme.cardBorder}
            borderRadius="md"
            minH="56px"
            gap={1}
            px={1.5}
            _hover={{ borderColor: dashboardTheme.title }}
          >
            <Text fontSize="10px" fontWeight="semibold" color={dashboardTheme.text}>
              {tile.name}
            </Text>
            <Text
              fontSize="8px"
              color={dashboardTheme.meta}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              maxW="100%"
            >
              {tile.description ?? tile.category}
            </Text>
          </Link>
        </GridItem>
      ))}
    </Grid>
  );
}
