import { Button, Field, Input, Stack } from '@chakra-ui/react';
import { ArrowRight } from 'lucide-react';
import type { ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';

import { useSetupWizard } from '../hooks/useSetupWizard';
import { SetupWizardFormValues } from '../schema';
import { SetupStepCard } from '../SetupStepCard';

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
        <Field.Root invalid={errors.username !== undefined}>
          <Field.Label color="text.primary">Username</Field.Label>
          <Input autoComplete="username" shape="pill" {...register('username')} />
          <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
        </Field.Root>
        <Field.Root invalid={errors.newPassword !== undefined}>
          <Field.Label color="text.primary">New password</Field.Label>
          <Input
            type="password"
            autoComplete="new-password"
            shape="pill"
            {...register('newPassword')}
          />
          <Field.ErrorText>{errors.newPassword?.message}</Field.ErrorText>
        </Field.Root>
        <Field.Root invalid={errors.confirmPassword !== undefined}>
          <Field.Label color="text.primary">Confirm password</Field.Label>
          <Input
            type="password"
            autoComplete="new-password"
            shape="pill"
            {...register('confirmPassword')}
          />
          <Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
        </Field.Root>
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
