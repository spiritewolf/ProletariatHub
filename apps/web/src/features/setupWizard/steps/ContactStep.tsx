import { Button, HStack, Stack, Text } from '@chakra-ui/react';
import { InputWithLabel } from '@proletariat-hub/web/shared/ui';
import { ArrowRight } from 'lucide-react';
import type { ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';

import { useSetupWizard } from '../hooks/useSetupWizard';
import { SetupStepCard } from '../SetupStepCard';
import { SetupWizardFormValues } from '../types';

export function ContactStep(): ReactElement {
  const {
    register,
    formState: { errors },
  } = useFormContext<SetupWizardFormValues>();
  const { goToNextWizardStep, goToPrevWizardStep, skipToNextWizardStep } = useSetupWizard();

  const onContinueAfterContact = async (): Promise<void> => {
    await goToNextWizardStep();
  };

  return (
    <SetupStepCard
      title="Should the Hub need to get in contact"
      description="Optional for now — add phone, email, or handles so your Comrades can coordinate with you."
    >
      <Stack gap={5}>
        <InputWithLabel
          isRootInvalid={errors.phoneNumber !== undefined}
          inputLabel="Phone (SMS)"
          inputType="tel"
          inputAutoComplete="tel"
          registerMethods={register('phoneNumber')}
          errorMessage={errors.phoneNumber?.message}
        />
        <InputWithLabel
          isRootInvalid={errors.email !== undefined}
          inputLabel="Email"
          inputType="email"
          inputAutoComplete="email"
          registerMethods={register('email')}
          errorMessage={errors.email?.message}
        />
        <InputWithLabel
          isRootInvalid={errors.signalUsername !== undefined}
          inputLabel="Signal username"
          registerMethods={register('signalUsername')}
          errorMessage={errors.signalUsername?.message}
        />
        <InputWithLabel
          isRootInvalid={errors.telegramUsername !== undefined}
          inputLabel="Telegram username"
          registerMethods={register('telegramUsername')}
          errorMessage={errors.telegramUsername?.message}
        />
        <Text fontSize="xs" color="text.secondary">
          You can fill these in later from Settings if you prefer.
        </Text>
        <HStack justifyContent="space-between">
          <Button type="button" variant="outline" size="sm" onClick={goToPrevWizardStep}>
            Back
          </Button>
          <HStack w="full" justifyContent="flex-end">
            <Button type="button" variant="ghost" size="sm" onClick={skipToNextWizardStep}>
              Skip for now
            </Button>

            <Button type="button" size="sm" variant="solid" onClick={onContinueAfterContact}>
              Continue <ArrowRight size={18} aria-hidden style={{ display: 'inline' }} />
            </Button>
          </HStack>
        </HStack>
      </Stack>
    </SetupStepCard>
  );
}
