import type { UseStepsReturn } from '@chakra-ui/react';
import type { UseMutationResult } from '@tanstack/react-query';
import { createContext } from 'react';

import type { SetupSteps } from './constants';
import type { SetupWizardFormValues } from './schema';

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
