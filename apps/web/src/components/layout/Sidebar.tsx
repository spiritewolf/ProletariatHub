import { Box, Button, Flex } from '@chakra-ui/react';
import { Link } from 'react-router';

import { DashboardCopy } from '../../features/dashboard/dashboardCopy';
import { AppPath } from '../../lib/appPaths';
import { dashboardTheme } from '../../styles/dashboardTheme';

type SidebarProps = {
  onLogout: () => void;
};

export function Sidebar({ onLogout }: SidebarProps): React.ReactElement {
  return (
    <Flex
      direction="column"
      w="40px"
      flexShrink={0}
      minH={0}
      bg={dashboardTheme.sidebarBg}
      borderRightWidth="1px"
      borderColor={dashboardTheme.cardBorder}
      py={2}
      gap={1}
      align="center"
    >
      <Link
        to={AppPath.Root}
        style={{
          width: '100%',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: dashboardTheme.sidebarFg,
          fontSize: '14px',
          borderRadius: '4px',
          textDecoration: 'none',
        }}
        title={DashboardCopy.sidebarNavDashboard}
        onMouseEnter={(event) => {
          event.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        {DashboardCopy.sidebarIconDashboard}
      </Link>
      <Link
        to={AppPath.Docs}
        style={{
          width: '100%',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: dashboardTheme.sidebarFg,
          fontSize: '14px',
          borderRadius: '4px',
          textDecoration: 'none',
        }}
        title={DashboardCopy.sidebarNavDocs}
        onMouseEnter={(event) => {
          event.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        {DashboardCopy.sidebarIconDocs}
      </Link>
      <Link
        to={AppPath.Shopping}
        style={{
          width: '100%',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: dashboardTheme.sidebarFg,
          fontSize: '14px',
          borderRadius: '4px',
          textDecoration: 'none',
        }}
        title={DashboardCopy.sidebarNavShopping}
        onMouseEnter={(event) => {
          event.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        {DashboardCopy.sidebarIconShopping}
      </Link>
      <Box flex={1} minH={2} />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        h="36px"
        px={0}
        color={dashboardTheme.sidebarFg}
        title={DashboardCopy.sidebarNavLogout}
        onClick={() => {
          void onLogout();
        }}
      >
        {DashboardCopy.sidebarIconLogout}
      </Button>
    </Flex>
  );
}
