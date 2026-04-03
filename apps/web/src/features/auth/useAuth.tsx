import {
  type AuthenticatedComrade,
  loginSuccessResponseSchema,
  okResponseSchema,
  sessionResponseSchema,
} from '@proletariat-hub/contracts';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { apiJsonValidated } from '../../lib/api';

type AuthState = {
  authenticatedComrade: AuthenticatedComrade | null;
  isLoading: boolean;
  refreshAuthenticatedComrade: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticatedComrade, setAuthenticatedComrade] = useState<AuthenticatedComrade | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuthenticatedComrade = useCallback(async () => {
    try {
      const data = await apiJsonValidated('/api/auth/session', sessionResponseSchema);
      setAuthenticatedComrade(data.comrade);
    } catch {
      setAuthenticatedComrade(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await apiJsonValidated('/api/auth/session', sessionResponseSchema);
        if (!cancelled) {
          setAuthenticatedComrade(data.comrade);
        }
      } catch {
        if (!cancelled) {
          setAuthenticatedComrade(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const data = await apiJsonValidated('/api/auth/login', loginSuccessResponseSchema, {
      method: 'POST',
      json: { username, password },
    });
    setAuthenticatedComrade(data.comrade);
  }, []);

  const logout = useCallback(async () => {
    await apiJsonValidated('/api/auth/logout', okResponseSchema, { method: 'POST' });
    setAuthenticatedComrade(null);
  }, []);

  const value = useMemo(
    () => ({
      authenticatedComrade,
      isLoading,
      refreshAuthenticatedComrade,
      login,
      logout,
    }),
    [authenticatedComrade, isLoading, refreshAuthenticatedComrade, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth outside AuthProvider');
  }
  return ctx;
}
