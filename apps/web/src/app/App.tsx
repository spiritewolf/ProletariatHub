import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from '../features/auth/useAuth';
import { queryClient } from '../lib/queryClient';
import { AppRoutes } from './routes/_routes';

export function App(): React.ReactNode {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
