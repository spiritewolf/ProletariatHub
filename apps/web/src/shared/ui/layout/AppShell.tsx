import { Box } from '@chakra-ui/react';
import { Topbar, TOPBAR_HEIGHT } from '@proletariat-hub/web/shared/ui/layout/Topbar';
import type { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';

export function AppShell(): ReactElement {
  return (
    <Box minH="100dvh" bg="bg.dark" color="text.primary">
      <Topbar />
      <Box as="main" pt={TOPBAR_HEIGHT} h="100dvh" display="flex" flexDirection="column">
        <Outlet />
      </Box>
    </Box>
  );
}
