import { Center, Spinner, Text } from '@chakra-ui/react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { dashboardTheme } from './dashboard/dashboardTheme';
import { ChangePasswordPage } from './pages/ChangePasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { SetupWizardPage } from './pages/SetupWizardPage';
import { ShoppingPage } from './pages/ShoppingPage';

function AuthedLayout() {
  const { authenticatedComrade, loading } = useAuth();
  const loc = useLocation();

  if (loading) {
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

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AuthedLayout />}>
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/setup" element={<SetupWizardPage />} />
        <Route path="/" element={<DashboardPage />} />
        <Route path="/shopping" element={<ShoppingPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
