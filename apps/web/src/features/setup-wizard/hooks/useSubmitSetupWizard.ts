import { useAuthStoreMock } from '@proletariat-hub/web/shared/hooks/auth/authStoreMock';
import type { SetupWizardFormValues } from '@proletariat-hub/web/shared/setup-wizard/schema';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';

export function useSubmitSetupWizard(): UseMutationResult<void, Error, SetupWizardFormValues> {
  return useMutation<void, Error, SetupWizardFormValues>({
    mutationFn: async (data: SetupWizardFormValues): Promise<void> => {
      useAuthStoreMock.getState().completeSetup(data);
    },
  });
}
