import { Box } from '@chakra-ui/react';
import {
  Topbar,
  TOPBAR_BLOCK_SIZE,
  TOPBAR_HEIGHT,
} from '@proletariat-hub/web/shared/ui/layout/Topbar';
import type { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';

export function AppShell(): ReactElement {
  return (
    <Box minH="100dvh" bg="bg.page" color="text.primary">
      <Topbar />
      <Box
        as="main"
        pt={TOPBAR_HEIGHT}
        display="flex"
        flexDirection="column"
        minH={{ base: 'min-content', lg: `calc(100dvh - ${TOPBAR_BLOCK_SIZE})` }}
        h={{ lg: `calc(100dvh - ${TOPBAR_BLOCK_SIZE})` }}
        overflow={{ base: 'visible', lg: 'hidden' }}
      >
        <Box flex="1" minH="0" display="flex" flexDirection="column" w="100%" h="100%">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
