import { Box, Button, Field, HStack, Input, Stack, Text } from '@chakra-ui/react';
import {
  type RecruitLineEditorState,
  recruitSchema,
  type SetupWizardFormValues,
} from '@proletariat-hub/web/shared/setup-wizard/schema';
import { ArrowRight } from 'lucide-react';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { useSetupWizard } from '../hooks/useSetupWizard';
import { SetupStepCard } from '../SetupStepCard';

const initialRecruitLine: RecruitLineEditorState = {
  username: '',
  password: '',
  phoneNumber: '',
  email: '',
  signalUsername: '',
  telegramUsername: '',
};

export function ComradesStep(): ReactElement {
  const { control } = useFormContext<SetupWizardFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'recruits' });
  const { goToNextWizardStep, goToPrevWizardStep } = useSetupWizard();

  const [recruitLine, setRecruitLine] = useState<RecruitLineEditorState>(initialRecruitLine);
  const [recruitLineError, setRecruitLineError] = useState<string | null>(null);

  const onSaveRecruit = (): void => {
    const parsed = recruitSchema.safeParse(recruitLine);
    if (!parsed.success) {
      const first = parsed.error.flatten().fieldErrors;
      const msg =
        first.username?.[0] ??
        first.email?.[0] ??
        first.password?.[0] ??
        'Check the recruit fields and try again.';
      setRecruitLineError(msg);
      return;
    }
    setRecruitLineError(null);
    append(parsed.data);
    setRecruitLine(initialRecruitLine);
  };

  return (
    <SetupStepCard title="Recruit your Comrades">
      <Stack gap={5}>
        <Text color="text.secondary" fontSize="sm" lineHeight="tall">
          Add household Comrades now, or skip and invite them later. Optional password defaults to
          &quot;password&quot; when left blank.
        </Text>
        {fields.length > 0 ? (
          <Stack as="ul" gap={3} listStyleType="none" pl={0}>
            {fields.map((field, index) => (
              <Box
                as="li"
                key={field.id}
                borderWidth="1px"
                borderColor="border.primary"
                borderRadius="md"
                p={3}
              >
                <HStack justify="space-between" align="flex-start" gap={3} flexWrap="wrap">
                  <Stack gap={1}>
                    <Text fontWeight="semibold" color="text.primary">
                      {field.username}
                    </Text>
                    <Text fontSize="sm" color="text.secondary">
                      {[field.phoneNumber, field.email].filter(Boolean).join(' · ') ||
                        'No contact yet'}
                    </Text>
                  </Stack>
                  <Button type="button" size="sm" variant="outline" onClick={() => remove(index)}>
                    Remove
                  </Button>
                </HStack>
              </Box>
            ))}
          </Stack>
        ) : (
          <Text fontSize="sm" color="text.secondary">
            No Comrades added yet.
          </Text>
        )}
        <Stack gap={3} borderWidth="1px" borderColor="border.primary" borderRadius="md" p={4}>
          <Text fontWeight="semibold" color="text.primary">
            Add Comrade
          </Text>
          <Field.Root invalid={recruitLineError !== null}>
            <Field.Label color="text.primary">Username</Field.Label>
            <Input
              value={recruitLine.username}
              onChange={(e) => setRecruitLine((line) => ({ ...line, username: e.target.value }))}
              autoComplete="off"
              variant="outline"
              borderRadius="full"
            />
            <Field.Label color="text.primary" mt={2}>
              Password (optional)
            </Field.Label>
            <Input
              type="password"
              value={recruitLine.password ?? ''}
              onChange={(e) => setRecruitLine((line) => ({ ...line, password: e.target.value }))}
              autoComplete="new-password"
              variant="outline"
              borderRadius="full"
            />
            <Field.Label color="text.primary" mt={2}>
              SMS number (optional)
            </Field.Label>
            <Input
              value={recruitLine.phoneNumber ?? ''}
              onChange={(e) => setRecruitLine((line) => ({ ...line, phoneNumber: e.target.value }))}
              autoComplete="tel"
              variant="outline"
              borderRadius="full"
            />
            <Field.Label color="text.primary" mt={2}>
              Email (optional)
            </Field.Label>
            <Input
              type="email"
              value={recruitLine.email ?? ''}
              onChange={(e) => setRecruitLine((line) => ({ ...line, email: e.target.value }))}
              autoComplete="email"
              variant="outline"
              borderRadius="full"
            />
            <Field.Label color="text.primary" mt={2}>
              Signal (optional)
            </Field.Label>
            <Input
              value={recruitLine.signalUsername ?? ''}
              onChange={(e) =>
                setRecruitLine((line) => ({ ...line, signalUsername: e.target.value }))
              }
              variant="outline"
              borderRadius="full"
            />
            <Field.Label color="text.primary" mt={2}>
              Telegram (optional)
            </Field.Label>
            <Input
              value={recruitLine.telegramUsername ?? ''}
              onChange={(e) =>
                setRecruitLine((line) => ({ ...line, telegramUsername: e.target.value }))
              }
              variant="outline"
              borderRadius="full"
            />
            {recruitLineError !== null ? (
              <Field.ErrorText>{recruitLineError}</Field.ErrorText>
            ) : null}
          </Field.Root>
          <Button type="button" variant="outline" onClick={onSaveRecruit}>
            Save
          </Button>
        </Stack>
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
          <Stack direction={{ base: 'column', sm: 'row' }} gap={3}>
            <Button type="button" variant="outline" flex={1} onClick={goToNextWizardStep}>
              Skip
            </Button>
            <Button type="button" size="lg" variant="outline" flex={1} onClick={goToNextWizardStep}>
              Next <ArrowRight size={18} aria-hidden style={{ display: 'inline' }} />
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </SetupStepCard>
  );
}
