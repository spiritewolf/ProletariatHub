import { Flex } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import { useAuth } from '../../auth/AuthContext';
import { dashboardTheme } from '../dashboardTheme';
import { DashboardSidebarNav } from '../sidebar/DashboardSidebarNav';

type AuthenticatedShellProps = {
  topBar: ReactNode;
  children: ReactNode;
};

/** Sidebar + top bar + scrollable main (dashboard chrome without the widget grid). */
export function AuthenticatedShell({ topBar, children }: AuthenticatedShellProps) {
  const { logout } = useAuth();

  return (
    <Flex h="100vh" w="100%" overflow="hidden" bg={dashboardTheme.mainChromeBg}>
      <DashboardSidebarNav
        onLogout={() => {
          void logout();
        }}
      />
      <Flex direction="column" flex={1} minW={0} minH={0}>
        {topBar}
        <Flex
          direction="column"
          flex={1}
          minH={0}
          overflowY="auto"
          p={3}
          gap={3}
          bg={dashboardTheme.mainBg}
        >
          {children}
        </Flex>
      </Flex>
    </Flex>
  );
}
