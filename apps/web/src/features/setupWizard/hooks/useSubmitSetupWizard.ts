import { ComradeRole } from '@proletariat-hub/types';
import { useAuth } from '@proletariat-hub/web/shared/hooks';
import { trpc } from '@proletariat-hub/web/shared/trpc';
import { useMemo } from 'react';

export function useSubmitSetupWizard() {
  const { comrade } = useAuth();
  const utils = trpc.useUtils();
  const onSuccess = async (): Promise<void> => {
    await utils.auth.findUniqueComradeFromSession.invalidate();
  };
  const adminMutation = trpc.comrade.completeAdminSetup.useMutation({ onSuccess });
  const memberMutation = trpc.comrade.completeMemberSetup.useMutation({ onSuccess });
  const isAdmin = comrade?.role === ComradeRole.ADMIN;
  return useMemo(
    () => (isAdmin ? adminMutation : memberMutation),
    [isAdmin, adminMutation, memberMutation],
  );
}
