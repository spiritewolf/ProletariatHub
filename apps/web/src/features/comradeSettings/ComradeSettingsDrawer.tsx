import { Box, Button, Drawer, Flex, HStack, Stack, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Comrade } from '@proletariat-hub/types';
import { trpc } from '@proletariat-hub/web/shared/trpc';
import { InputWithLabel } from '@proletariat-hub/web/shared/ui';
import { Settings, Sparkle, X } from 'lucide-react';
import { type ReactElement, useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { HubPeripherySection } from './HubPeripherySection';
import {
  comradeSettingsFormSchema,
  type ComradeSettingsFormValues,
  type ComradeSettingsParsedValues,
} from './types';

function formatComradeSettingsSaveError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Could not save settings';
}

function buildDefaultValues(comrade: Comrade): ComradeSettingsFormValues {
  return {
    username: comrade.username,
    birthDate:
      comrade.settings.birthDate === null
        ? ''
        : comrade.settings.birthDate.toISOString().slice(0, 10),
    phoneNumber: comrade.settings.phoneNumber ?? '',
    email: comrade.settings.email ?? '',
    signalUsername: comrade.settings.signalUsername ?? '',
    telegramUsername: comrade.settings.telegramUsername ?? '',
    newPassword: '',
    confirmPassword: '',
  };
}

type ComradeSettingsDrawerProps = {
  comrade: Comrade;
  isOpen: boolean;
  onClose: () => void;
};

export function ComradeSettingsDrawer({
  comrade,
  isOpen,
  onClose,
}: ComradeSettingsDrawerProps): ReactElement {
  const utils = trpc.useUtils();
  const updateOneMutation = trpc.comrade.updateOne.useMutation();

  const formMethods = useForm<ComradeSettingsFormValues, unknown, ComradeSettingsParsedValues>({
    resolver: zodResolver(comradeSettingsFormSchema),
    mode: 'onChange',
    defaultValues: buildDefaultValues(comrade),
  });

  const { handleSubmit, register, reset, formState, getValues } = formMethods;

  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      reset(buildDefaultValues(comrade));
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, comrade, reset]);

  const onSubmitForm = (values: ComradeSettingsParsedValues): void => {
    updateOneMutation.mutate(
      {
        email: values.email,
        phoneNumber: values.phoneNumber,
        signalUsername: values.signalUsername,
        telegramUsername: values.telegramUsername,
        birthDate: values.birthDate,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      },
      {
        onSuccess: () => {
          void utils.auth.findUniqueComradeFromSession.invalidate();
          reset({
            ...getValues(),
            newPassword: '',
            confirmPassword: '',
          });
        },
      },
    );
  };

  const onDrawerOpenChange = (details: { open: boolean }): void => {
    if (!details.open) {
      updateOneMutation.reset();
      onClose();
    }
  };

  const saveErrorMessage = updateOneMutation.isError
    ? formatComradeSettingsSaveError(updateOneMutation.error)
    : null;

  const isSaveDisabled = !formState.isDirty || updateOneMutation.isPending;

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={onDrawerOpenChange}
      placement="end"
      size={{ base: 'full', md: 'lg' }}
    >
      <Drawer.Backdrop bg="blackAlpha.600" />
      <Drawer.Positioner padding={0}>
        <Drawer.Content
          w={{ base: '100%', md: '31vw' }}
          minW={{ base: '100%', md: 'auto' }}
          maxW={{ base: '100%', md: '31vw' }}
          display="flex"
          flexDirection="column"
          h="100dvh"
          maxH="100dvh"
          overflow="hidden"
          bg="bg.primary"
          borderStartWidth={{ base: '0', md: '1px' }}
          borderColor="border.primary"
          borderRadius={{ base: '0', md: 'l2' }}
        >
          <Box
            flexShrink={0}
            bg="topbar.primary"
            color="text.light"
            px={{ base: 5, md: 6 }}
            pt={5}
            pb={4}
          >
            <Flex justify="space-between" align="flex-start" gap={3}>
              <HStack gap={3} align="flex-start">
                <Box color="text.light" opacity={0.92} lineHeight={0} pt="0.5">
                  <Settings size={18} strokeWidth={2} aria-hidden />
                </Box>
                <Stack gap={1}>
                  <Text fontSize="md" fontWeight="medium" color="text.light" lineHeight="short">
                    Comrade settings
                  </Text>
                  <Text fontSize="xs" color="text.light" opacity={0.92} lineHeight="tall">
                    Your profile, contact info, and security.
                  </Text>
                </Stack>
              </HStack>
              <Drawer.CloseTrigger asChild>
                <Button
                  type="button"
                  aria-label="Close settings"
                  variant="ghost"
                  size="sm"
                  color="text.light"
                  opacity={0.75}
                  minW="10"
                  px={2}
                  _hover={{ opacity: 1, bg: 'whiteAlpha.200' }}
                >
                  <X size={18} aria-hidden />
                </Button>
              </Drawer.CloseTrigger>
            </Flex>
          </Box>

          <FormProvider {...formMethods}>
            <Flex direction="column" flex="1" minH={0}>
              <Drawer.Body
                flex="1"
                minH={0}
                minW={0}
                overflowY="auto"
                overscrollBehavior="contain"
                px={{ base: 5, md: 6 }}
                py={5}
              >
                <Stack gap={5} align="stretch">
                  <form onSubmit={handleSubmit(onSubmitForm)}>
                    <Stack gap={5} align="stretch">
                      <Stack gap={3}>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          letterSpacing="0.12em"
                          color="accent.primary"
                          textTransform="uppercase"
                        >
                          Profile
                        </Text>
                        <InputWithLabel
                          inputLabel="Username"
                          inputReadOnly
                          inputDisabled
                          inputBg="bg.secondary"
                          registerMethods={register('username')}
                        />
                        <InputWithLabel
                          isRootInvalid={formState.errors.birthDate !== undefined}
                          inputLabel="Birth date"
                          inputType="date"
                          registerMethods={register('birthDate')}
                          errorMessage={formState.errors.birthDate?.message}
                        />
                      </Stack>

                      <Stack gap={3}>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          letterSpacing="0.12em"
                          color="accent.primary"
                          textTransform="uppercase"
                        >
                          Contact info
                        </Text>
                        <InputWithLabel
                          isRootInvalid={formState.errors.phoneNumber !== undefined}
                          inputLabel="Phone (SMS)"
                          inputType="tel"
                          inputAutoComplete="tel"
                          inputPlaceholder="+1 (555) 000-0000"
                          registerMethods={register('phoneNumber')}
                          errorMessage={formState.errors.phoneNumber?.message}
                        />
                        <InputWithLabel
                          isRootInvalid={formState.errors.email !== undefined}
                          inputLabel="Email"
                          inputType="email"
                          inputAutoComplete="email"
                          inputPlaceholder="comrade@hub.local"
                          registerMethods={register('email')}
                          errorMessage={formState.errors.email?.message}
                        />
                        <InputWithLabel
                          isRootInvalid={formState.errors.signalUsername !== undefined}
                          inputLabel="Signal username"
                          inputPlaceholder="@comrade.01"
                          registerMethods={register('signalUsername')}
                          errorMessage={formState.errors.signalUsername?.message}
                        />
                        <InputWithLabel
                          isRootInvalid={formState.errors.telegramUsername !== undefined}
                          inputLabel="Telegram username"
                          inputPlaceholder="@comrade_01"
                          registerMethods={register('telegramUsername')}
                          errorMessage={formState.errors.telegramUsername?.message}
                        />
                      </Stack>

                      <Stack gap={3}>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          letterSpacing="0.12em"
                          color="accent.primary"
                          textTransform="uppercase"
                        >
                          Security
                        </Text>
                        <InputWithLabel
                          isRootInvalid={formState.errors.newPassword !== undefined}
                          inputLabel="New password"
                          inputType="password"
                          inputAutoComplete="new-password"
                          inputPlaceholder="New password"
                          registerMethods={register('newPassword')}
                          errorMessage={formState.errors.newPassword?.message}
                        />
                        <InputWithLabel
                          isRootInvalid={formState.errors.confirmPassword !== undefined}
                          inputLabel="Confirm password"
                          inputType="password"
                          inputPlaceholder="Confirm password"
                          registerMethods={register('confirmPassword')}
                          errorMessage={formState.errors.confirmPassword?.message}
                        />
                      </Stack>

                      {saveErrorMessage ? (
                        <Text fontSize="sm" color="status.error" role="alert">
                          {saveErrorMessage}
                        </Text>
                      ) : null}

                      <Button
                        type="submit"
                        width="full"
                        size="sm"
                        variant="solid"
                        shape="pill"
                        fontSize="sm"
                        disabled={isSaveDisabled}
                        loading={updateOneMutation.isPending}
                      >
                        Save changes <Sparkle size={16} aria-hidden style={{ display: 'inline' }} />
                      </Button>
                    </Stack>
                  </form>

                  <HubPeripherySection comrade={comrade} />
                </Stack>
              </Drawer.Body>
            </Flex>
          </FormProvider>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
}
