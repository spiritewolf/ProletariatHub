import { Box, Button, Field, HStack, Input, Stack, Text } from '@chakra-ui/react';
import { ComradeAvatarIconType } from '@proletariat-hub/web/shared';
import { ArrowRight, Plus } from 'lucide-react';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { useSetupWizard } from '../hooks/useSetupWizard';
import { recruitSchema, type SetupWizardFormValues } from '../schema';
import { SetupStepCard } from '../SetupStepCard';
import { RecruitAvatarGlyph } from './components/RecruitAvatarGlyph';
import { RecruitAvatarPicker } from './components/RecruitAvatarPicker';

export function ComradesStep(): ReactElement {
  const { control } = useFormContext<SetupWizardFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'recruits' });
  const { goToNextWizardStep, goToPrevWizardStep } = useSetupWizard();

  const [recruitUsername, setRecruitUsername] = useState<string>('');
  const [selectedIcon, setSelectedIcon] = useState<ComradeAvatarIconType>(
    ComradeAvatarIconType.USER,
  );
  const [recruitLineError, setRecruitLineError] = useState<string | null>(null);

  const onSaveRecruit = (): void => {
    const parsed = recruitSchema.safeParse({ username: recruitUsername, icon: selectedIcon });
    if (!parsed.success) {
      const errorMessage =
        parsed.error.flatten().fieldErrors.username?.[0] ?? 'Username is required.';
      setRecruitLineError(errorMessage);
      return;
    }
    setRecruitLineError(null);
    append(parsed.data);
    setRecruitUsername('');
    setSelectedIcon(ComradeAvatarIconType.USER);
  };

  return (
    <SetupStepCard title="Recruit your Comrades">
      <Stack gap={5}>
        <Text color="text.secondary" fontSize="sm" lineHeight="tall">
          Recruit your Comrades by adding them to your hub with their username only, they can change
          this later. Each new Comrade&apos;s default password is{' '}
          <Text as="span" fontWeight="semibold" color="text.primary">
            password
          </Text>{' '}
          until they log in and change it.
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
                <HStack justify="space-between" align="center" gap={3}>
                  <HStack gap={3} align="center" flex={1} minW={0}>
                    <RecruitAvatarGlyph iconType={field.icon ?? 'USER'} size={22} />
                    <Text fontWeight="semibold" color="text.primary" truncate>
                      {field.username}
                    </Text>
                  </HStack>
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
          <RecruitAvatarPicker selectedIconType={selectedIcon} onChange={setSelectedIcon} />
          <Field.Root invalid={recruitLineError !== null}>
            <Field.Label color="text.primary">Username</Field.Label>
            <HStack gap={3} align="flex-end" w="100%">
              <Box flex={1} minW={0}>
                <Input
                  value={recruitUsername}
                  onChange={(e) => setRecruitUsername(e.target.value)}
                  autoComplete="off"
                  variant="outline"
                  borderRadius="full"
                />
              </Box>
              <Button
                type="button"
                variant="outline"
                size="sm"
                flexShrink={0}
                onClick={onSaveRecruit}
              >
                Recruit <Plus size={18} aria-hidden style={{ display: 'inline' }} />
              </Button>
            </HStack>
            {recruitLineError !== null ? (
              <Field.ErrorText>{recruitLineError}</Field.ErrorText>
            ) : null}
          </Field.Root>
        </Stack>
        <HStack justifyContent="space-between">
          <Button type="button" variant="outline" size="sm" onClick={goToPrevWizardStep}>
            Back
          </Button>
          <HStack w="full" justifyContent="flex-end">
            <Button type="button" variant="ghost" size="sm" onClick={goToNextWizardStep}>
              Skip for now
            </Button>

            <Button type="button" size="sm" variant="solid" onClick={goToNextWizardStep}>
              Continue <ArrowRight size={18} aria-hidden style={{ display: 'inline' }} />
            </Button>
          </HStack>
        </HStack>
      </Stack>
    </SetupStepCard>
  );
}
