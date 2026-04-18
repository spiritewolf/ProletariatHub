import { Accordion, HStack, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Periphery } from '@proletariat-hub/types';
import { HubPeripheryCategory as HubPeripheryCategoryConst } from '@proletariat-hub/types';
import { useUpdateOnePeriphery } from '@proletariat-hub/web/shared/trpc';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import {
  hubPeripheryDrawerFormSchema,
  type HubPeripheryDrawerFormValues,
  mapPeripheryToFormValues,
} from '../types';
import { PeripheryCategoryBadge } from './PeripheryCategoryBadge';
import { PeripheryExpandedFields } from './PeripheryExpandedFields';
import { PeripheryGlyph } from './PeripheryGlyph';
import { PeripheryRemoveButton } from './PeripheryRemoveButton';

type PeripheryListItemProps = {
  periphery: Periphery;
  isOpen: boolean;
  onToggle: () => void;
};

export function PeripheryListItem({
  periphery,
  isOpen,
  onToggle,
}: PeripheryListItemProps): ReactElement {
  const [isRemoveConfirmOpen, setIsRemoveConfirmOpen] = useState(false);
  const form = useForm<HubPeripheryDrawerFormValues>({
    resolver: zodResolver(hubPeripheryDrawerFormSchema),
    mode: 'onChange',
    defaultValues: mapPeripheryToFormValues(periphery),
  });

  const updateMutation = useUpdateOnePeriphery({
    onSuccess: async () => {
      setIsRemoveConfirmOpen(false);
      onToggle();
    },
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    form.reset(mapPeripheryToFormValues(periphery));
  }, [form, isOpen, periphery]);

  const onSubmitEdit = (values: HubPeripheryDrawerFormValues): void => {
    const avatarIcon: string | null =
      values.peripheryCategory === HubPeripheryCategoryConst.PET ? values.petAvatarIcon : null;
    updateMutation.mutate({
      id: periphery.id,
      name: values.name,
      peripheryCategory: values.peripheryCategory,
      birthDate: values.birthDate || null,
      avatarIcon,
    });
  };

  const onCancelEdit = (): void => {
    setIsRemoveConfirmOpen(false);
    onToggle();
  };

  return (
    <Accordion.Item
      value={periphery.id}
      borderWidth="1px"
      borderColor="border.primary"
      borderRadius="md"
      overflow="hidden"
    >
      <Accordion.ItemTrigger
        cursor="pointer"
        w="100%"
        py={2.5}
        px={3}
        display="flex"
        alignItems="center"
        gap={3}
        borderRadius="0"
        fontWeight="normal"
        color="inherit"
        bg="transparent"
        _hover={{ bg: 'bg.secondary' }}
        _open={{ bg: 'bg.secondary' }}
      >
        <HStack gap={3} align="center" flex="1" minW={0}>
          <PeripheryGlyph
            category={periphery.peripheryCategory}
            avatarIcon={periphery.settings.avatarIcon}
          />
          <Text fontSize="sm" fontWeight="medium" color="text.primary" flex="1" minW={0} truncate>
            {periphery.name}
          </Text>
          <PeripheryCategoryBadge category={periphery.peripheryCategory} />
        </HStack>
        <Accordion.ItemIndicator color="text.tertiary" />
      </Accordion.ItemTrigger>
      <Accordion.ItemContent>
        <Accordion.ItemBody px={0} pt={0} pb={0}>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmitEdit)}>
              <PeripheryExpandedFields
                onCancel={onCancelEdit}
                isSaveDisabled={!form.formState.isDirty || updateMutation.isPending}
                isSaveLoading={updateMutation.isPending}
                onRemoveClick={() => {
                  setIsRemoveConfirmOpen(true);
                }}
                removeConfirmContent={
                  isRemoveConfirmOpen ? (
                    <PeripheryRemoveButton
                      peripheryId={periphery.id}
                      onCancel={() => {
                        setIsRemoveConfirmOpen(false);
                      }}
                      onRemoved={onToggle}
                    />
                  ) : null
                }
              />
            </form>
          </FormProvider>
        </Accordion.ItemBody>
      </Accordion.ItemContent>
    </Accordion.Item>
  );
}
