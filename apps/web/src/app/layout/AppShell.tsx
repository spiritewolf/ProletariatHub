import { Box } from '@chakra-ui/react';
import type { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';

import { Topbar, TOPBAR_HEIGHT } from './Topbar';

export function AppShell(): ReactElement {
  return (
    <Box minH="100dvh" bg="bg.dark" color="text.primary">
      <Topbar />
      <Box
        as="main"
        pt={TOPBAR_HEIGHT}
        h="100dvh"
        display="flex"
        flexDirection="column"
        minH="0"
        overflowY="auto"
        overflowX="hidden"
        w="full"
      >
        <Outlet />
      </Box>
    </Box>
  );
}
