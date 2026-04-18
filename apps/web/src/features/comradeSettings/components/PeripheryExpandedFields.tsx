import { Box, Button, Field, Flex, HStack, Input, Stack } from '@chakra-ui/react';
import { HubPeripheryCategory as HubPeripheryCategoryConst } from '@proletariat-hub/types';
import { RECRUIT_AVATAR_MAP } from '@proletariat-hub/web/features/setupWizard/steps/components/constants';
import type { ReactElement } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { PERIPHERY_PET_GLYPH_ICONS } from '../constants';
import type { HubPeripheryDrawerFormValues } from '../types';

type PeripheryExpandedFieldsProps = {
  onCancel: () => void;
  isSaveDisabled: boolean;
  isSaveLoading: boolean;
  onRemoveClick?: () => void;
  removeConfirmContent?: ReactElement | null;
};

export function PeripheryExpandedFields({
  onCancel,
  isSaveDisabled,
  isSaveLoading,
  onRemoveClick,
  removeConfirmContent,
}: PeripheryExpandedFieldsProps): ReactElement {
  const { register, control, formState } = useFormContext<HubPeripheryDrawerFormValues>();
  const category = useWatch({ control, name: 'peripheryCategory' });

  return (
    <Stack gap={3} pt={3} pb={2} px={3} borderTopWidth="1px" borderColor="border.secondary">
      <Field.Root invalid={formState.errors.name !== undefined}>
        <Field.Label textStyle="fieldLabel">Name</Field.Label>
        <Input shape="pill" {...register('name')} />
        <Field.ErrorText>{formState.errors.name?.message}</Field.ErrorText>
      </Field.Root>
      <Field.Root>
        <Field.Label textStyle="fieldLabel">Category</Field.Label>
        <Controller
          name="peripheryCategory"
          control={control}
          render={({ field }) => (
            <HStack gap={2} flexWrap="wrap">
              <Button
                type="button"
                shape="pill"
                size="sm"
                variant={field.value === HubPeripheryCategoryConst.PERSON ? 'solid' : 'outline'}
                colorPalette="brandPalette"
                onClick={() => {
                  field.onChange(HubPeripheryCategoryConst.PERSON);
                }}
              >
                Person
              </Button>
              <Button
                type="button"
                shape="pill"
                size="sm"
                variant={field.value === HubPeripheryCategoryConst.PET ? 'solid' : 'outline'}
                colorPalette="brandPalette"
                onClick={() => {
                  field.onChange(HubPeripheryCategoryConst.PET);
                }}
              >
                Pet
              </Button>
            </HStack>
          )}
        />
      </Field.Root>
      {category === HubPeripheryCategoryConst.PET ? (
        <Field.Root invalid={formState.errors.petAvatarIcon !== undefined}>
          <Field.Label textStyle="fieldLabel">Pet icon</Field.Label>
          <Controller
            name="petAvatarIcon"
            control={control}
            render={({ field: petField }) => (
              <HStack gap={2} flexWrap="wrap">
                {PERIPHERY_PET_GLYPH_ICONS.map((iconType) => {
                  const { Icon, color } = RECRUIT_AVATAR_MAP[iconType];
                  const isSelected = petField.value === iconType;
                  return (
                    <Button
                      key={iconType}
                      type="button"
                      variant={isSelected ? 'solid' : 'outline'}
                      colorPalette="brandPalette"
                      size="sm"
                      shape="pill"
                      px={3}
                      color={isSelected ? undefined : color}
                      aria-pressed={isSelected}
                      aria-label={RECRUIT_AVATAR_MAP[iconType].label}
                      onClick={() => {
                        petField.onChange(iconType);
                      }}
                    >
                      <Icon size={18} aria-hidden />
                    </Button>
                  );
                })}
              </HStack>
            )}
          />
          <Field.ErrorText>{formState.errors.petAvatarIcon?.message}</Field.ErrorText>
        </Field.Root>
      ) : null}
      <Field.Root invalid={formState.errors.birthDate !== undefined}>
        <Field.Label textStyle="fieldLabel">Birth date</Field.Label>
        <Input type="date" shape="pill" {...register('birthDate')} />
        <Field.ErrorText>{formState.errors.birthDate?.message}</Field.ErrorText>
      </Field.Root>
      {removeConfirmContent != null ? (
        removeConfirmContent
      ) : (
        <Flex justify="space-between" align="center" gap={3} flexWrap="wrap" pt={1}>
          {onRemoveClick !== undefined ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              colorPalette="destructivePalette"
              fontWeight="medium"
              onClick={onRemoveClick}
            >
              Remove
            </Button>
          ) : (
            <Box />
          )}
          <HStack gap={2} justify="flex-end" flex="1" minW={0}>
            <Button type="button" variant="ghost" size="sm" shape="pill" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="solid"
              size="sm"
              shape="pill"
              disabled={isSaveDisabled}
              loading={isSaveLoading}
            >
              Save
            </Button>
          </HStack>
        </Flex>
      )}
    </Stack>
  );
}
