import { Steps, useSteps } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ComradeRole } from '@proletariat-hub/web/shared';
import { useAuth } from '@proletariat-hub/web/shared/hooks/auth/useAuth';
import { type ReactElement, type ReactNode, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { SETUP_STEPS_ADMIN, SETUP_STEPS_MEMBER } from './constants';
import { useSubmitSetupWizard } from './hooks/useSubmitSetupWizard';
import { SetupWizardFormValues, setupWizardSchema } from './schema';
import { SetupWizardContext } from './SetupWizardContext';

type SetupWizardProviderProps = {
  children: ReactNode;
};

export function SetupWizardProvider({ children }: SetupWizardProviderProps): ReactElement {
  const { comrade } = useAuth();
  const isAdmin = comrade?.role === ComradeRole.ADMIN;
  const setupSteps = isAdmin ? SETUP_STEPS_ADMIN : SETUP_STEPS_MEMBER;

  const form = useForm<SetupWizardFormValues>({
    resolver: zodResolver(setupWizardSchema),
    mode: 'onBlur',
    defaultValues: {
      username: comrade?.username ?? '',
      newPassword: '',
      confirmPassword: '',
      phoneNumber: '',
      email: '',
      signalUsername: '',
      telegramUsername: '',
      hubName: 'My Hub',
      recruits: [],
    },
  });

  const stepper = useSteps({
    defaultStep: 0,
    count: setupSteps.length,
    linear: true,
  });

  const submitMutation = useSubmitSetupWizard();

  const contextValue = useMemo(
    () => ({ stepper, submitMutation, setupSteps, isAdmin }),
    [stepper, submitMutation, setupSteps, isAdmin],
  );

  return (
    <FormProvider {...form}>
      <Steps.RootProvider value={stepper}>
        <SetupWizardContext.Provider value={contextValue}>{children}</SetupWizardContext.Provider>
      </Steps.RootProvider>
    </FormProvider>
  );
}
