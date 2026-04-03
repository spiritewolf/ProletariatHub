import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { ChangePasswordPage } from '../../pages/ChangePasswordPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { DocsPage } from '../../pages/docs/DocsPage';
import { LoginPage } from '../../pages/LoginPage';
import { SetupWizardPage } from '../../pages/SetupWizardPage';
import { ShoppingPage } from '../../pages/ShoppingPage';
import { AppLayoutRoute } from './_app';

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
