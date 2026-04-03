import { GridItem, Link, Text } from '@chakra-ui/react';

import { dashboardTheme } from '../../../styles/dashboardTheme';
import type { MediaTile } from './MediaWidget.types';

type MediaTileProps = {
  tile: MediaTile;
};

export function MediaTile({ tile }: MediaTileProps): React.ReactElement {
  return (
    <GridItem>
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
  );
}
