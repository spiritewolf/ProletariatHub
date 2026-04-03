import { Navigate, Route, Routes } from 'react-router';

import AppLayoutRoute from '@/components/layout/AppLayoutRoute';

import ChangePasswordPage from './routes/ChangePasswordPage';
import DashboardPage from './routes/DashboardPage';
import DocsPage from './routes/DocsPage';
import LoginPage from './routes/LoginPage';
import SetupWizardPage from './routes/SetupWizardPage';
import ShoppingPage from './routes/ShoppingPage';

export function AppRoutes(): React.ReactElement {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppLayoutRoute />}>
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/setup" element={<SetupWizardPage />} />
        <Route path="/" element={<DashboardPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/shopping" element={<ShoppingPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
