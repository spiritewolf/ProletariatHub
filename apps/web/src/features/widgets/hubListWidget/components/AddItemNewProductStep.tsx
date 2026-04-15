import { Button, Field, HStack, Input, NativeSelect, Stack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { toaster } from '@proletariat-hub/web/shared/ui';
import type { ReactElement } from 'react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import {
  ADD_ITEM_FREQUENCY,
  ADD_ITEM_FREQUENCY_LABEL,
  ADD_ITEM_PRIORITY_FORM,
  ADD_ITEM_PRIORITY_LABEL,
  addItemNewProductFormSchema,
  type AddItemNewProductFormValues,
  type AddItemNewProductParsedValues,
} from '../addItemFormSchema';
import { MOCK_CATEGORIES, MOCK_VENDORS } from '../mockCatalog';

type AddItemNewProductStepProps = {
  initialName: string;
  onSubmitSuccess: () => void;
};

function buildDefaultValues(initialName: string): AddItemNewProductFormValues {
  return {
    name: initialName,
    category: '',
    vendorName: '',
    frequency: ADD_ITEM_FREQUENCY.ONE_TIME,
    priority: ADD_ITEM_PRIORITY_FORM.MEDIUM,
    notes: '',
  };
}

export function AddItemNewProductStep({
  initialName,
  onSubmitSuccess,
}: AddItemNewProductStepProps): ReactElement {
  const form = useForm<AddItemNewProductFormValues, unknown, AddItemNewProductParsedValues>({
    resolver: zodResolver(addItemNewProductFormSchema),
    defaultValues: buildDefaultValues(initialName),
  });

  const { register, control, handleSubmit, reset, formState } = form;

  useEffect(() => {
    reset(buildDefaultValues(initialName));
  }, [initialName, reset]);

  const onSubmit = (_values: AddItemNewProductParsedValues): void => {
    toaster.create({
      type: 'success',
      title: 'Product created',
      description: 'Added to your hub list (mock).',
    });
    onSubmitSuccess();
  };

  const pillInputProps = {
    variant: 'outline' as const,
    borderRadius: 'full' as const,
    py: '2',
    px: '3.5',
    fontSize: 'sm',
    borderColor: 'border.primary',
    bg: 'bg.primary',
  };

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(onSubmit)(e);
      }}
    >
      <Stack gap="4" align="stretch">
        <Field.Root invalid={formState.errors.name !== undefined}>
          <Field.Label fontSize="xs" fontWeight="medium" color="text.primary">
            Name
          </Field.Label>
          <Input {...register('name')} {...pillInputProps} />
          <Field.ErrorText>{formState.errors.name?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root>
          <Field.Label fontSize="xs" fontWeight="medium" color="text.primary">
            Category
          </Field.Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <NativeSelect.Root size="md" variant="outline" w="full">
                <NativeSelect.Field
                  {...field}
                  borderRadius="full"
                  borderColor="border.primary"
                  bg="bg.primary"
                  value={field.value ?? ''}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                >
                  <option value="">Select category</option>
                  {MOCK_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            )}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label fontSize="xs" fontWeight="medium" color="text.primary">
            Vendor
          </Field.Label>
          <Input
            {...register('vendorName')}
            {...pillInputProps}
            list="hub-add-item-vendor-options"
            placeholder="Choose or type a vendor"
          />
          <datalist id="hub-add-item-vendor-options">
            {MOCK_VENDORS.map((v) => (
              <option key={v} value={v} />
            ))}
          </datalist>
        </Field.Root>

        <Field.Root invalid={formState.errors.frequency !== undefined}>
          <Field.Label fontSize="xs" fontWeight="medium" color="text.primary">
            How often?
          </Field.Label>
          <Controller
            name="frequency"
            control={control}
            render={({ field }) => (
              <NativeSelect.Root size="md" variant="outline" w="full">
                <NativeSelect.Field
                  borderRadius="full"
                  borderColor="border.primary"
                  bg="bg.primary"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                >
                  {Object.values(ADD_ITEM_FREQUENCY).map((value) => (
                    <option key={value} value={value}>
                      {ADD_ITEM_FREQUENCY_LABEL[value]}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            )}
          />
          <Field.ErrorText>{formState.errors.frequency?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root>
          <Field.Label fontSize="xs" fontWeight="medium" color="text.primary">
            Priority
          </Field.Label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <HStack gap="2" flexWrap="wrap">
                {Object.values(ADD_ITEM_PRIORITY_FORM).map((value) => {
                  const isSelected = field.value === value;
                  return (
                    <Button
                      key={value}
                      type="button"
                      size="sm"
                      borderRadius="full"
                      variant={isSelected ? 'solid' : 'outline'}
                      bg={isSelected ? 'accent.primary' : undefined}
                      color={isSelected ? 'text.light' : 'text.primary'}
                      borderColor="border.primary"
                      onClick={() => {
                        field.onChange(value);
                      }}
                    >
                      {ADD_ITEM_PRIORITY_LABEL[value]}
                    </Button>
                  );
                })}
              </HStack>
            )}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label fontSize="xs" fontWeight="medium" color="text.primary">
            Notes (optional)
          </Field.Label>
          <Input {...register('notes')} {...pillInputProps} placeholder="e.g. preferred brand" />
        </Field.Root>

        <Button
          type="submit"
          w="full"
          size="lg"
          borderRadius="full"
          colorPalette="brandPalette"
          variant="solid"
          mt="2"
        >
          Create &amp; add to list
        </Button>
      </Stack>
    </form>
  );
}
