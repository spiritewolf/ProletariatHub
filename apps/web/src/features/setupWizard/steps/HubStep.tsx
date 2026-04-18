import { Button, HStack, Stack } from '@chakra-ui/react';
import { InputWithLabel } from '@proletariat-hub/web/shared/ui';
import { ArrowRight } from 'lucide-react';
import type { ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';

import { useSetupWizard } from '../hooks/useSetupWizard';
import { SetupStepCard } from '../SetupStepCard';
import { SetupWizardFormValues } from '../types';

export function HubStep(): ReactElement {
  const {
    register,
    formState: { errors },
  } = useFormContext<SetupWizardFormValues>();
  const { goToNextWizardStep, goToPrevWizardStep } = useSetupWizard();

  return (
    <SetupStepCard title="Name Your Hub" description="Pick something your Comrades will recognize!">
      <Stack gap={5}>
        <InputWithLabel
          isRootInvalid={errors.hubName !== undefined}
          inputLabel="Hub name"
          inputHelperText="This is your hub's name. You can change it later in Settings."
          registerMethods={register('hubName')}
          errorMessage={errors.hubName?.message}
        />
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
