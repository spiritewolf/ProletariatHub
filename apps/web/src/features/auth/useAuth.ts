import { type AuthenticatedComrade } from '@proletariat-hub/contracts';
import { createContext, useContext } from 'react';

export type AuthState = {
  authenticatedComrade: AuthenticatedComrade | null;
  isLoading: boolean;
  refreshAuthenticatedComrade: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthState | null>(null);

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth outside AuthProvider');
  }
  return ctx;
}
