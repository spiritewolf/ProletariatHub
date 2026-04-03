import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { BrowserRouter } from 'react-router';

import { AuthProvider } from '../features/auth/AuthProvider';
import { queryClient } from '../lib/queryClient';
import { AppRoutes } from './AppRoutes';

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
