import type { UseStepsReturn } from '@chakra-ui/react';
import { createContext } from 'react';

import type { SetupSteps } from './constants';
import { CompleteWizardMutation } from './hooks/useSetupWizard';

export type SetupWizardContextValue = {
  stepper: UseStepsReturn;
  submitMutation: CompleteWizardMutation;
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
