import { Box, Button, Field, HStack, Stack, Text } from '@chakra-ui/react';
import { ComradeAvatarIconType } from '@proletariat-hub/types';
import { toaster } from '@proletariat-hub/web/shared/ui';
import { Sparkle } from 'lucide-react';
import type { ReactElement } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { useSetupWizard } from '../hooks/useSetupWizard';
import { type SetupWizardFormValues } from '../schema';
import { SetupStepCard } from '../SetupStepCard';
import { RecruitAvatarGlyph } from './components/RecruitAvatarGlyph';

export function LaunchStep(): ReactElement {
  const { control } = useFormContext<SetupWizardFormValues>();
  const hubName = useWatch({ control, name: 'hubName' });
  const recruits = useWatch({ control, name: 'recruits' }) ?? [];
  const { goToPrevWizardStep, submitCompleteSetup, submitMutation } = useSetupWizard();

  const onSubmitSetup = async (): Promise<void> => {
    await submitCompleteSetup({
      onMutationSuccess: () => {
        toaster.create({
          type: 'success',
          title: 'Setup complete',
          description: 'Welcome to your Hub.',
        });
      },
    });
  };

  return (
    <SetupStepCard title="Comrades of the Hub, unite!">
      <Stack gap={5}>
        <Text textStyle="helperText" lineHeight="tall">
          Here&apos;s what we&apos;ll start with. You can always adjust people and the Hub name in
          Settings later.
        </Text>
        <Stack gap={2}>
          <Text fontWeight="semibold" color="text.primary">
            Hub
          </Text>
          <Text color="text.secondary">{hubName}</Text>
        </Stack>
        <Stack gap={2}>
          <Text fontWeight="semibold" color="text.primary">
            Comrades
          </Text>
          {recruits.length === 0 ? (
            <Text color="text.secondary">None added — it&apos;s just you for now.</Text>
          ) : (
            <Stack as="ul" gap={2} pl={0} listStyleType="none">
              {recruits.map((r) => (
                <Box as="li" key={r.id} color="text.secondary">
                  <HStack gap={3} align="center">
                    <RecruitAvatarGlyph iconType={r.icon ?? ComradeAvatarIconType.USER} size={20} />
                    <Text>{r.username}</Text>
                  </HStack>
                </Box>
              ))}
            </Stack>
          )}
        </Stack>
        {submitMutation.error !== null ? (
          <Field.Root invalid>
            <Field.ErrorText>
              {submitMutation.error instanceof Error
                ? submitMutation.error.message
                : 'Something went wrong.'}
            </Field.ErrorText>
          </Field.Root>
        ) : null}
        <HStack w="full" justifyContent="flex-end">
          <Button type="button" variant="outline" size="sm" onClick={goToPrevWizardStep}>
            Back
          </Button>

          <Button type="button" size="sm" variant="solid" onClick={onSubmitSetup}>
            Finish
            <Sparkle size={18} aria-hidden style={{ display: 'inline' }} />
          </Button>
        </HStack>
      </Stack>
    </SetupStepCard>
  );
}
