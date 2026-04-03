import { Center, Spinner, Text } from '@chakra-ui/react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../../features/auth/useAuth';
import { dashboardTheme } from '../../styles/dashboardTheme';

export function AppLayoutRoute(): React.ReactElement {
  const { authenticatedComrade, isLoading } = useAuth();
  const loc = useLocation();

  if (isLoading) {
    return (
      <Center minH="100vh" bg={dashboardTheme.mainChromeBg} color={dashboardTheme.text}>
        <Spinner size="lg" color={dashboardTheme.title} />
        <Text ml={4}>Loading…</Text>
      </Center>
    );
  }
  if (!authenticatedComrade) {
    return <Navigate to="/login" replace />;
  }
  if (authenticatedComrade.mustChangePassword && loc.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />;
  }
  const adminNeedsSetup =
    !authenticatedComrade.mustChangePassword &&
    authenticatedComrade.isAdmin &&
    !authenticatedComrade.hasCompletedSetup &&
    loc.pathname !== '/setup';
  if (adminNeedsSetup) {
    return <Navigate to="/setup" replace />;
  }
  const setupDoneRedirect =
    !authenticatedComrade.mustChangePassword &&
    authenticatedComrade.hasCompletedSetup &&
    (loc.pathname === '/setup' || loc.pathname === '/change-password');
  if (setupDoneRedirect) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
