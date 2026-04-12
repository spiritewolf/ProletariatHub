import { Box, Button, Field, Stack, Text } from '@chakra-ui/react';
import type { SetupWizardFormValues } from '@proletariat-hub/web/shared/setup-wizard/schema';
import { ArrowRight } from 'lucide-react';
import type { ReactElement } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { useSetupWizard } from '../hooks/useSetupWizard';
import { SetupStepCard } from '../SetupStepCard';

export function LaunchStep(): ReactElement {
  const { control } = useFormContext<SetupWizardFormValues>();
  const hubName = useWatch({ control, name: 'hubName' });
  const recruits = useWatch({ control, name: 'recruits' }) ?? [];
  const { goToPrevWizardStep, submitWizard, submitMutation } = useSetupWizard();

  const onBegin = async (): Promise<void> => {
    await submitWizard();
  };

  return (
    <SetupStepCard title="You're ready">
      <Stack gap={5}>
        <Text color="text.secondary" fontSize="sm" lineHeight="tall">
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
                <Box as="li" key={`${r.username}-${r.email ?? ''}`} color="text.secondary">
                  {r.username}
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
            loading={submitMutation.isPending}
            onClick={onBegin}
          >
            Begin the revolution <ArrowRight size={18} aria-hidden style={{ display: 'inline' }} />
          </Button>
        </Stack>
      </Stack>
    </SetupStepCard>
  );
}
