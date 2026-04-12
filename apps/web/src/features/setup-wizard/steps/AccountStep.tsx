import { Button, Field, Input, Stack } from '@chakra-ui/react';
import type { SetupWizardFormValues } from '@proletariat-hub/web/shared/setup-wizard/schema';
import { ArrowRight } from 'lucide-react';
import type { ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';

import { useSetupWizard } from '../hooks/useSetupWizard';
import { SetupStepCard } from '../SetupStepCard';

export function AccountStep(): ReactElement {
  const {
    register,
    formState: { errors },
  } = useFormContext<SetupWizardFormValues>();
  const {
    goToNextWizardStep,
    goToPrevWizardStep,
    submitWizard,
    setupSteps,
    stepper,
    submitMutation,
  } = useSetupWizard();

  const isMemberOnlyFlow = setupSteps.length === 1;
  const isFirstStep = stepper.value === 0;

  const onAccountStepNext = async (): Promise<void> => {
    if (isMemberOnlyFlow) {
      await submitWizard();
      return;
    }
    await goToNextWizardStep();
  };

  return (
    <SetupStepCard
      title="Welcome & account setup"
      description="Update the username you were given if you like, and set a new password for this Hub."
    >
      <Stack gap={5}>
        <Field.Root invalid={errors.username !== undefined}>
          <Field.Label color="text.primary">Username</Field.Label>
          <Input
            autoComplete="username"
            variant="outline"
            borderRadius="full"
            {...register('username')}
          />
          <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
        </Field.Root>
        <Field.Root invalid={errors.newPassword !== undefined}>
          <Field.Label color="text.primary">New password</Field.Label>
          <Input
            type="password"
            autoComplete="new-password"
            variant="outline"
            borderRadius="full"
            {...register('newPassword')}
          />
          <Field.ErrorText>{errors.newPassword?.message}</Field.ErrorText>
        </Field.Root>
        <Field.Root invalid={errors.confirmPassword !== undefined}>
          <Field.Label color="text.primary">Confirm password</Field.Label>
          <Input
            type="password"
            autoComplete="new-password"
            variant="outline"
            borderRadius="full"
            {...register('confirmPassword')}
          />
          <Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
        </Field.Root>
        {submitMutation.error !== null ? (
          <Field.Root invalid>
            <Field.ErrorText>
              {submitMutation.error instanceof Error
                ? submitMutation.error.message
                : 'Something went wrong.'}
            </Field.ErrorText>
          </Field.Root>
        ) : null}
        <Stack gap={3} w="full" align="stretch">
          {!isFirstStep ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              alignSelf="flex-start"
              onClick={goToPrevWizardStep}
            >
              Back
            </Button>
          ) : null}
          <Button
            type="button"
            size="lg"
            variant="outline"
            width="full"
            loading={submitMutation.isPending}
            onClick={onAccountStepNext}
          >
            {isMemberOnlyFlow ? (
              'Save and enter the Hub'
            ) : (
              <>
                Continue the march{' '}
                <ArrowRight size={18} aria-hidden style={{ display: 'inline' }} />
              </>
            )}
          </Button>
        </Stack>
      </Stack>
    </SetupStepCard>
  );
}
