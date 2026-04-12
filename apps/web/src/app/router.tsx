import { AppShell } from '@proletariat-hub/web/app/layout/AppShell';
import { requireAuthLoader } from '@proletariat-hub/web/app/requireAuthLoader';
import { Dashboard, Login, SetupWizardPage, ThemePreview } from '@proletariat-hub/web/features';
import type { ReactElement } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Dashboard />, loader: requireAuthLoader() },
      {
        path: 'setup',
        element: <SetupWizardPage />,
        loader: requireAuthLoader({ onboardingIncompleteOnly: true }),
      },
      { path: 'login', element: <Login /> },
      { path: 'theme-preview', element: <ThemePreview /> },
    ],
  },
]);

export function AppRouter(): ReactElement {
  return <RouterProvider router={router} />;
}
