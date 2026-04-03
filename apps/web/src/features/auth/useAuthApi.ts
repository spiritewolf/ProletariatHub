import {
  loginSuccessResponseSchema,
  okResponseSchema,
  sessionResponseSchema,
} from '@proletariat-hub/contracts';
import { useCallback } from 'react';

import { apiJsonValidated } from '@/lib/api';

export function useAuthApi() {
  const fetchSession = useCallback(
    () => apiJsonValidated('/api/auth/session', sessionResponseSchema),
    [],
  );

  const loginRequest = useCallback(
    (username: string, password: string) =>
      apiJsonValidated('/api/auth/login', loginSuccessResponseSchema, {
        method: 'POST',
        json: { username, password },
      }),
    [],
  );

  const logoutRequest = useCallback(
    () => apiJsonValidated('/api/auth/logout', okResponseSchema, { method: 'POST' }),
    [],
  );

  return { fetchSession, loginRequest, logoutRequest };
}
