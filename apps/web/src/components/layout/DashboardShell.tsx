import { Flex } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import { useAuth } from '../../features/auth/useAuth';
import { dashboardTheme } from '../../styles/dashboardTheme';
import { Sidebar } from './Sidebar';

type DashboardShellProps = {
  topBar: ReactNode;
  children: ReactNode;
};

export function DashboardShell({ topBar, children }: DashboardShellProps): React.ReactElement {
  const { logout } = useAuth();

  return (
    <Flex h="100vh" w="100%" overflow="hidden" bg={dashboardTheme.mainChromeBg}>
      <Sidebar
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
