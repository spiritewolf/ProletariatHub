import { ThemePreviewPage } from '@proletariat-hub/web/app/ThemePreviewPage';
import { DashboardPage } from '@proletariat-hub/web/features/dashboard/DashboardPage';
import { AppShell } from '@proletariat-hub/web/shared/ui/layout/AppShell';
import type { ReactElement } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'theme-preview', element: <ThemePreviewPage /> },
    ],
  },
]);

export function AppRouter(): ReactElement {
  return <RouterProvider router={router} />;
}
