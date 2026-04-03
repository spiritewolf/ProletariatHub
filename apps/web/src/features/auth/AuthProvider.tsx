import { type AuthenticatedComrade } from '@proletariat-hub/contracts';
import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { AuthContext } from './useAuth';
import { useAuthApi } from './useAuthApi';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { fetchSession, loginRequest, logoutRequest } = useAuthApi();
  const [authenticatedComrade, setAuthenticatedComrade] = useState<AuthenticatedComrade | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuthenticatedComrade = useCallback(async () => {
    try {
      const data = await fetchSession();
      setAuthenticatedComrade(data.comrade);
    } catch {
      setAuthenticatedComrade(null);
    }
  }, [fetchSession]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await fetchSession();
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
  }, [fetchSession]);

  const login = useCallback(
    async (username: string, password: string) => {
      const data = await loginRequest(username, password);
      setAuthenticatedComrade(data.comrade);
    },
    [loginRequest],
  );

  const logout = useCallback(async () => {
    await logoutRequest();
    setAuthenticatedComrade(null);
  }, [logoutRequest]);

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
