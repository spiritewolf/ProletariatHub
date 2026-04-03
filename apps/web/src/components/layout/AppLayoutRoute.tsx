import { Center, Spinner, Text } from '@chakra-ui/react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/features/auth/useAuth';
import { AppPath } from '@/lib/appPaths';
import { dashboardTheme } from '@/styles/dashboardTheme';

function pathEquals(pathname: string, appPath: AppPath): boolean {
  return pathname === String(appPath);
}

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
    return <Navigate to={AppPath.Login} replace />;
  }
  if (
    authenticatedComrade.mustChangePassword &&
    !pathEquals(loc.pathname, AppPath.ChangePassword)
  ) {
    return <Navigate to={AppPath.ChangePassword} replace />;
  }
  const adminNeedsSetup =
    !authenticatedComrade.mustChangePassword &&
    authenticatedComrade.isAdmin &&
    !authenticatedComrade.hasCompletedSetup &&
    !pathEquals(loc.pathname, AppPath.Setup);
  if (adminNeedsSetup) {
    return <Navigate to={AppPath.Setup} replace />;
  }
  const setupDoneRedirect =
    !authenticatedComrade.mustChangePassword &&
    authenticatedComrade.hasCompletedSetup &&
    (pathEquals(loc.pathname, AppPath.Setup) || pathEquals(loc.pathname, AppPath.ChangePassword));
  if (setupDoneRedirect) {
    return <Navigate to={AppPath.Root} replace />;
  }

  return <Outlet />;
}
