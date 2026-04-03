import { Navigate, Route, Routes } from 'react-router-dom';

import { AppLayoutRoute } from './routes/_app';
import { ChangePasswordPage } from './routes/_app.change-password';
import { DashboardPage } from './routes/_app.dashboard';
import { DocsPage } from './routes/_app.docs';
import { SetupWizardPage } from './routes/_app.setup';
import { ShoppingPage } from './routes/_app.shopping';
import { LoginPage } from './routes/_auth.login';

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
