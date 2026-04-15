import { Button, Field, HStack, Input, Stack, Text } from '@chakra-ui/react';
import { ArrowRight } from 'lucide-react';
import type { ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';

import { useSetupWizard } from '../hooks/useSetupWizard';
import { SetupWizardFormValues } from '../schema';
import { SetupStepCard } from '../SetupStepCard';

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
        <Field.Root invalid={errors.phoneNumber !== undefined}>
          <Field.Label color="text.primary">Phone (SMS)</Field.Label>
          <Input
            type="tel"
            autoComplete="tel"
            variant="outline"
            borderRadius="full"
            {...register('phoneNumber')}
          />
          <Field.ErrorText>{errors.phoneNumber?.message}</Field.ErrorText>
        </Field.Root>
        <Field.Root invalid={errors.email !== undefined}>
          <Field.Label color="text.primary">Email</Field.Label>
          <Input
            type="email"
            autoComplete="email"
            variant="outline"
            borderRadius="full"
            {...register('email')}
          />
          <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
        </Field.Root>
        <Field.Root invalid={errors.signalUsername !== undefined}>
          <Field.Label color="text.primary">Signal username</Field.Label>
          <Input variant="outline" borderRadius="full" {...register('signalUsername')} />
          <Field.ErrorText>{errors.signalUsername?.message}</Field.ErrorText>
        </Field.Root>
        <Field.Root invalid={errors.telegramUsername !== undefined}>
          <Field.Label color="text.primary">Telegram username</Field.Label>
          <Input variant="outline" borderRadius="full" {...register('telegramUsername')} />
          <Field.ErrorText>{errors.telegramUsername?.message}</Field.ErrorText>
        </Field.Root>
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
