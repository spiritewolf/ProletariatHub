import { Button, Field, HStack, Input, Stack } from '@chakra-ui/react';
import { ArrowRight } from 'lucide-react';
import type { ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';

import { useSetupWizard } from '../hooks/useSetupWizard';
import { SetupWizardFormValues } from '../schema';
import { SetupStepCard } from '../SetupStepCard';

export function HubStep(): ReactElement {
  const {
    register,
    formState: { errors },
  } = useFormContext<SetupWizardFormValues>();
  const { goToNextWizardStep, goToPrevWizardStep } = useSetupWizard();

  return (
    <SetupStepCard title="Name Your Hub" description="Pick something your Comrades will recognize!">
      <Stack gap={5}>
        <Field.Root invalid={errors.hubName !== undefined}>
          <Field.Label color="text.primary">Hub name</Field.Label>
          <Input variant="outline" borderRadius="full" {...register('hubName')} />
          <Field.HelperText color="text.secondary">
            This is your household&apos;s name. You can change it later in Settings.
          </Field.HelperText>
          <Field.ErrorText>{errors.hubName?.message}</Field.ErrorText>
        </Field.Root>
        <HStack w="full" justifyContent="flex-end">
          <Button type="button" variant="outline" size="sm" onClick={goToPrevWizardStep}>
            Back
          </Button>

          <Button type="button" size="sm" variant="solid" onClick={goToNextWizardStep}>
            Continue <ArrowRight size={18} aria-hidden style={{ display: 'inline' }} />
          </Button>
        </HStack>
      </Stack>
    </SetupStepCard>
  );
}
