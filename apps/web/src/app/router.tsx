import { Dashboard, Login, ThemePreview } from '@proletariat-hub/web/features';
import { AppShell } from '@proletariat-hub/web/shared/ui/layout/AppShell';
import type { ReactElement } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'theme-preview', element: <ThemePreview /> },
      { path: 'login', element: <Login /> },
    ],
  },
]);

export function AppRouter(): ReactElement {
  return <RouterProvider router={router} />;
}
