import { useAuthStoreMock } from '@proletariat-hub/web/shared/hooks/auth/authStoreMock';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import type { SetupWizardFormValues } from '../schema';

export function useSubmitSetupWizard(): UseMutationResult<void, Error, SetupWizardFormValues> {
  return useMutation<void, Error, SetupWizardFormValues>({
    mutationFn: async (data: SetupWizardFormValues): Promise<void> => {
      useAuthStoreMock.getState().completeSetup(data);
    },
  });
}
