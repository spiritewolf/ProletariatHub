import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from '../auth/AuthContext';
import { queryClient } from '../queryClient';
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
