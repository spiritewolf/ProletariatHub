import { Button, Field, Input, Stack, Text } from '@chakra-ui/react';
import type { SetupWizardFormValues } from '@proletariat-hub/web/shared/setup-wizard/schema';
import { ArrowRight } from 'lucide-react';
import type { ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';

import { useSetupWizard } from '../hooks/useSetupWizard';
import { SetupStepCard } from '../SetupStepCard';

export function HubStep(): ReactElement {
  const {
    register,
    formState: { errors },
  } = useFormContext<SetupWizardFormValues>();
  const { goToNextWizardStep, goToPrevWizardStep } = useSetupWizard();

  return (
    <SetupStepCard title="Name Your Hub">
      <Stack gap={5}>
        <Field.Root invalid={errors.hubName !== undefined}>
          <Field.Label color="text.primary">Hub name</Field.Label>
          <Input variant="outline" borderRadius="full" {...register('hubName')} />
          <Field.HelperText color="text.secondary">
            This is your household&apos;s name. You can change it later in Settings.
          </Field.HelperText>
          <Field.ErrorText>{errors.hubName?.message}</Field.ErrorText>
        </Field.Root>
        <Text fontSize="sm" color="text.secondary" lineHeight="tall">
          Pick something your Comrades will recognize — it appears across lists and reminders.
        </Text>
        <Stack gap={3} w="full" align="stretch">
          <Button
            type="button"
            variant="outline"
            size="sm"
            alignSelf="flex-start"
            onClick={goToPrevWizardStep}
          >
            Back
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            width="full"
            onClick={goToNextWizardStep}
          >
            Continue the march <ArrowRight size={18} aria-hidden style={{ display: 'inline' }} />
          </Button>
        </Stack>
      </Stack>
    </SetupStepCard>
  );
}
