import type { UseStepsReturn } from '@chakra-ui/react';
import { SetupSteps, STEP_FORM_FIELDS } from '@proletariat-hub/web/shared';
import type { SetupWizardFormValues } from '@proletariat-hub/web/shared/setup-wizard/schema';
import type { UseMutationResult } from '@tanstack/react-query';
import { useCallback, useContext } from 'react';
import { useFormContext } from 'react-hook-form';

import { assertSetupWizardContext, SetupWizardContext } from '../SetupWizardContext';

export type SetupWizardHookProps = {
  stepper: UseStepsReturn;
  goToNextWizardStep: () => Promise<void>;
  goToPrevWizardStep: () => void;
  submitWizard: () => Promise<void>;
  submitMutation: UseMutationResult<void, Error, SetupWizardFormValues>;
  setupSteps: SetupSteps[];
  isAdmin: boolean;
  stepIndex: number;
};

export function useSetupWizard(): SetupWizardHookProps {
  const formMethods = useFormContext<SetupWizardFormValues>();
  const setupContext = useContext(SetupWizardContext);
  assertSetupWizardContext(setupContext);
  const { stepper, submitMutation, setupSteps, isAdmin } = setupContext;

  const goToNextWizardStep = useCallback(async (): Promise<void> => {
    const currentStepName = setupSteps[stepper.value];
    if (currentStepName !== undefined) {
      const fieldsToValidate = STEP_FORM_FIELDS[currentStepName];
      const canAdvance =
        fieldsToValidate.length === 0 || (await formMethods.trigger(fieldsToValidate));
      if (canAdvance) {
        stepper.goToNextStep();
      }
    }
  }, [formMethods, stepper, setupSteps]);

  const goToPrevWizardStep = useCallback((): void => {
    stepper.goToPrevStep();
  }, [stepper]);

  const submitWizard = useCallback(async (): Promise<void> => {
    await formMethods.handleSubmit((data) => {
      submitMutation.mutate(data);
    })();
  }, [formMethods, submitMutation]);

  return {
    stepper,
    goToNextWizardStep,
    goToPrevWizardStep,
    submitWizard,
    submitMutation,
    setupSteps,
    stepIndex: stepper.value,
    isAdmin,
  };
}
