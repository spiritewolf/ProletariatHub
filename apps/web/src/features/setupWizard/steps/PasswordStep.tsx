import { Button, Stack } from '@chakra-ui/react';
import { InputWithLabel } from '@proletariat-hub/web/shared/ui';
import { ArrowRight } from 'lucide-react';
import type { ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';

import { useSetupWizard } from '../hooks/useSetupWizard';
import { SetupStepCard } from '../SetupStepCard';
import { SetupWizardFormValues } from '../types';

export function PasswordStep(): ReactElement {
  const {
    register,
    formState: { errors },
  } = useFormContext<SetupWizardFormValues>();
  const { goToNextWizardStep } = useSetupWizard();

  const onContinueAfterPassword = async (): Promise<void> => {
    await goToNextWizardStep();
  };

  return (
    <SetupStepCard
      title="Username & Password"
      description="Update your username and set a new password."
    >
      <Stack gap={5}>
        <InputWithLabel
          isRootInvalid={errors.username !== undefined}
          inputLabel="Username"
          inputAutoComplete="username"
          registerMethods={register('username')}
          errorMessage={errors.username?.message}
        />
        <InputWithLabel
          isRootInvalid={errors.newPassword !== undefined}
          inputLabel="New password"
          inputType="password"
          inputAutoComplete="new-password"
          registerMethods={register('newPassword')}
          errorMessage={errors.newPassword?.message}
        />
        <InputWithLabel
          isRootInvalid={errors.confirmPassword !== undefined}
          inputLabel="Confirm password"
          inputType="password"
          inputAutoComplete="new-password"
          registerMethods={register('confirmPassword')}
          errorMessage={errors.confirmPassword?.message}
        />
        <Stack gap={3} w="full" align="stretch">
          <Button
            type="button"
            size="lg"
            variant="outline"
            width="full"
            onClick={onContinueAfterPassword}
          >
            Continue <ArrowRight size={18} aria-hidden style={{ display: 'inline' }} />
          </Button>
        </Stack>
      </Stack>
    </SetupStepCard>
  );
}
