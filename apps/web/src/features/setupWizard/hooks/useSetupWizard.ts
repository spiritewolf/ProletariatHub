import type { UseStepsReturn } from '@chakra-ui/react';
import { ComradeAvatarIconType } from '@proletariat-hub/types';
import { trpc } from '@proletariat-hub/web/shared/trpc';
import { useCallback, useContext } from 'react';
import { useFormContext } from 'react-hook-form';

import { SetupSteps, STEP_FORM_FIELDS } from '../constants';
import { assertSetupWizardContext, SetupWizardContext } from '../SetupWizardContext';
import type { SetupWizardFormValues } from '../types';

export type SubmitCompleteSetupOptions = {
  onMutationSuccess?: () => void;
};

export type CompleteWizardMutation = ReturnType<typeof trpc.comrade.completeAdminSetup.useMutation>;

export type SetupWizardHookProps = {
  stepper: UseStepsReturn;
  goToNextWizardStep: () => Promise<void>;
  skipToNextWizardStep: () => void;
  goToPrevWizardStep: () => void;
  submitCompleteSetup: (options?: SubmitCompleteSetupOptions) => Promise<void>;
  submitMutation: CompleteWizardMutation;
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
    const currentStepName: SetupSteps | undefined = setupSteps[stepper.value];
    if (currentStepName !== undefined) {
      const fieldsToValidate = STEP_FORM_FIELDS[currentStepName];
      const canAdvance =
        fieldsToValidate.length === 0 || (await formMethods.trigger(fieldsToValidate));
      if (canAdvance) {
        stepper.goToNextStep();
      }
    }
  }, [formMethods, stepper, setupSteps]);

  const skipToNextWizardStep = useCallback((): void => {
    const currentStepName = setupSteps[stepper.value];
    if (currentStepName === SetupSteps.CONTACT) {
      formMethods.clearErrors(['phoneNumber', 'email', 'signalUsername', 'telegramUsername']);
      formMethods.setValue('phoneNumber', '');
      formMethods.setValue('email', '');
      formMethods.setValue('signalUsername', '');
      formMethods.setValue('telegramUsername', '');
    }
    stepper.goToNextStep();
  }, [formMethods, setupSteps, stepper]);

  const goToPrevWizardStep = useCallback((): void => {
    stepper.goToPrevStep();
  }, [stepper]);

  const submitCompleteSetup = useCallback(
    async (options?: SubmitCompleteSetupOptions): Promise<void> => {
      await formMethods.handleSubmit((data) => {
        const onMutationSuccess = options?.onMutationSuccess;
        submitMutation.mutate(
          {
            ...data,
            email:
              data.email === undefined || data.email === null || data.email === ''
                ? undefined
                : data.email,
            recruits: data.recruits.map((recruit) => ({
              username: recruit.username,
              icon: recruit.icon ?? ComradeAvatarIconType.USER,
            })),
          },
          onMutationSuccess !== undefined ? { onSuccess: onMutationSuccess } : undefined,
        );
      })();
    },
    [formMethods, submitMutation],
  );

  return {
    stepper,
    goToNextWizardStep,
    skipToNextWizardStep,
    goToPrevWizardStep,
    submitCompleteSetup,
    submitMutation,
    setupSteps,
    stepIndex: stepper.value,
    isAdmin,
  };
}
