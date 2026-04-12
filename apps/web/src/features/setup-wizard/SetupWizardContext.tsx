import type { UseStepsReturn } from '@chakra-ui/react';
import { SetupSteps } from '@proletariat-hub/web/shared';
import type { SetupWizardFormValues } from '@proletariat-hub/web/shared/setup-wizard/schema';
import type { UseMutationResult } from '@tanstack/react-query';
import { createContext } from 'react';

export type SetupWizardContextValue = {
  stepper: UseStepsReturn;
  submitMutation: UseMutationResult<void, Error, SetupWizardFormValues>;
  setupSteps: SetupSteps[];
  isAdmin: boolean;
};

export const SetupWizardContext = createContext<SetupWizardContextValue | null>(null);

export function assertSetupWizardContext(
  value: SetupWizardContextValue | null,
): asserts value is SetupWizardContextValue {
  if (value === null) {
    throw new Error('useSetupWizard requires SetupWizardProvider');
  }
}
