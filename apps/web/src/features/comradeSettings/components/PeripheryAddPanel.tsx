import { Box, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { HubPeripheryCategory as HubPeripheryCategoryConst } from '@proletariat-hub/types';
import { useCreateOnePeriphery } from '@proletariat-hub/web/shared/trpc';
import { toaster } from '@proletariat-hub/web/shared/ui';
import type { ReactElement } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { PERIPHERY_FORM_DEFAULTS } from '../constants';
import { hubPeripheryDrawerFormSchema, type HubPeripheryDrawerFormValues } from '../types';
import { PeripheryExpandedFields } from './PeripheryExpandedFields';

type PeripheryAddPanelProps = {
  onCancel: () => void;
  onCreated?: () => void;
};

export function PeripheryAddPanel({ onCancel, onCreated }: PeripheryAddPanelProps): ReactElement {
  const form = useForm<HubPeripheryDrawerFormValues>({
    resolver: zodResolver(hubPeripheryDrawerFormSchema),
    mode: 'onChange',
    defaultValues: PERIPHERY_FORM_DEFAULTS,
  });

  const createMutation = useCreateOnePeriphery({
    onSuccess: async () => {
      form.reset(PERIPHERY_FORM_DEFAULTS);
      onCancel();
      onCreated?.();
    },
  });

  const onSubmitAdd = (values: HubPeripheryDrawerFormValues): void => {
    const avatarIcon: string | null =
      values.peripheryCategory === HubPeripheryCategoryConst.PET ? values.petAvatarIcon : null;
    createMutation.mutate(
      {
        name: values.name,
        peripheryCategory: values.peripheryCategory,
        birthDate: values.birthDate || null,
        avatarIcon,
      },
      {
        onSuccess: () => {
          toaster.create({
            type: 'success',
            title: 'Periphery added',
            description: 'The periphery member has been added to your Hub.',
          });
        },
      },
    );
  };

  return (
    <Box borderWidth="1px" borderColor="border.primary" borderRadius="md" overflow="hidden">
      <Box px={3} py={2} bg="bg.secondary">
        <Text fontSize="sm" fontWeight="semibold" color="text.primary">
          New periphery
        </Text>
      </Box>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmitAdd)}>
          <PeripheryExpandedFields
            onCancel={() => {
              form.reset(PERIPHERY_FORM_DEFAULTS);
              onCancel();
            }}
            isSaveDisabled={!form.formState.isDirty || createMutation.isPending}
            isSaveLoading={createMutation.isPending}
          />
        </form>
      </FormProvider>
    </Box>
  );
}
