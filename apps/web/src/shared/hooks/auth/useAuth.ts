import type { Comrade } from '@proletariat-hub/web/shared';
import { useMutation, type UseMutationResult, useQueryClient } from '@tanstack/react-query';

import { useAuthStoreMock } from './authStoreMock';

export type AuthLoginVariables = {
  username: string;
  password: string;
};

export type UseAuthResult = {
  comrade: Comrade | null;
  isAuthenticated: boolean;
  loginMutation: UseMutationResult<Comrade, Error, AuthLoginVariables>;
  logoutMutation: UseMutationResult<void, Error, void>;
};

export function useAuth(): UseAuthResult {
  const queryClient = useQueryClient();
  const comrade = useAuthStoreMock((state) => state.comrade);
  const isAuthenticated = Boolean(comrade);

  const loginMutation = useMutation<Comrade, Error, AuthLoginVariables>({
    mutationFn: async ({ username, password }: AuthLoginVariables): Promise<Comrade> => {
      return useAuthStoreMock.getState().createLoginSession(username, password);
    },
    onSuccess: () => {
      // TODO: invalidate tRPC / server-backed queries when real auth replaces the mock store.
    },
  });

  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: async (): Promise<void> => {
      useAuthStoreMock.getState().endLoginSession();
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });

  return {
    comrade,
    isAuthenticated,
    loginMutation,
    logoutMutation,
  };
}
