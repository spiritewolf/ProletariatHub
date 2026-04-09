import { ThemePreviewPage } from '@proletariat-hub/web/app/ThemePreviewPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ThemePreviewPage />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
