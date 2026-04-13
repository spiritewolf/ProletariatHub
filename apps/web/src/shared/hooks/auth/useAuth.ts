import type { Comrade } from '@proletariat-hub/web/shared';
import { trpc } from '@proletariat-hub/web/shared/lib/trpc';

export type AuthLoginVariables = {
  username: string;
  password: string;
};

type CreateOneLoginSessionMutation = ReturnType<typeof trpc.auth.createOneLoginSession.useMutation>;
type DeleteOneLoginSessionMutation = ReturnType<typeof trpc.auth.deleteOneLoginSession.useMutation>;
type FindUniqueComradeFromSessionQuery = ReturnType<
  typeof trpc.auth.findUniqueComradeFromSession.useQuery
>;

export type UseAuthResult = {
  comrade: Comrade | null;
  isAuthenticated: boolean;
  findUniqueComradeFromSessionQuery: FindUniqueComradeFromSessionQuery;
  createOneLoginSessionMutation: CreateOneLoginSessionMutation;
  deleteOneLoginSessionMutation: DeleteOneLoginSessionMutation;
};

export function useAuth(): UseAuthResult {
  const utils = trpc.useUtils();
  const findUniqueComradeFromSessionQuery = trpc.auth.findUniqueComradeFromSession.useQuery(
    undefined,
    {
      staleTime: Infinity,
      retry: false,
    },
  );

  const comrade: Comrade | null = findUniqueComradeFromSessionQuery.data ?? null;
  const isAuthenticated = Boolean(comrade);

  const createOneLoginSessionMutation = trpc.auth.createOneLoginSession.useMutation({
    onSuccess: async () => {
      await utils.auth.findUniqueComradeFromSession.invalidate();
    },
  });

  const deleteOneLoginSessionMutation = trpc.auth.deleteOneLoginSession.useMutation({
    onSuccess: async () => {
      await utils.auth.findUniqueComradeFromSession.invalidate();
    },
  });

  return {
    comrade,
    isAuthenticated,
    findUniqueComradeFromSessionQuery,
    createOneLoginSessionMutation,
    deleteOneLoginSessionMutation,
  };
}
