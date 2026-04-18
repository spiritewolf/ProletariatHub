import { Button, Field, Input, NativeSelect, Stack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { HubInventoryProductFrequency, HubListItemPriority } from '@proletariat-hub/types';
import { useCreateOneProduct, useFindManyCategories } from '@proletariat-hub/web/shared/trpc';
import { toaster } from '@proletariat-hub/web/shared/ui';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import {
  addItemNewProductFormSchema,
  type AddItemNewProductFormValues,
  type AddItemNewProductParsedValues,
  HUB_INVENTORY_FREQUENCY_LABEL,
} from '../types';
import { CategoryAutocomplete } from './CategoryAutocomplete';
import { InlineVendorCreator } from './InlineVendorCreator';
import { VendorAutocomplete } from './VendorAutocomplete';

export type AddItemListItemContext = {
  priority: HubListItemPriority;
  quantity: number;
  notes: string | null;
};

type AddItemNewProductStepProps = {
  initialName: string;
  listItemContext: AddItemListItemContext;
  onSubmitSuccess: () => void;
};

function buildDefaultValues(initialName: string): AddItemNewProductFormValues {
  return {
    name: initialName,
    brandName: null,
    categoryId: null,
    vendorId: null,
    purchaseFrequency: HubInventoryProductFrequency.ONE_TIME,
    customFrequencyDays: null,
    quantityInStock: 0,
  };
}

const HUB_INVENTORY_FREQUENCY_UI_ORDER: HubInventoryProductFrequency[] = [
  HubInventoryProductFrequency.ONE_TIME,
  HubInventoryProductFrequency.WEEKLY,
  HubInventoryProductFrequency.BIWEEKLY,
  HubInventoryProductFrequency.MONTHLY,
  HubInventoryProductFrequency.CUSTOM,
];

export function AddItemNewProductStep({
  initialName,
  listItemContext,
  onSubmitSuccess,
}: AddItemNewProductStepProps): ReactElement {
  const [vendorCreatorDraft, setVendorCreatorDraft] = useState<string | null>(null);

  const form = useForm<AddItemNewProductFormValues, unknown, AddItemNewProductParsedValues>({
    resolver: zodResolver(addItemNewProductFormSchema),
    defaultValues: buildDefaultValues(initialName),
  });

  const { register, control, handleSubmit, setValue, formState } = form;

  const categoryId = useWatch({ control, name: 'categoryId' });
  const vendorId = useWatch({ control, name: 'vendorId' });
  const purchaseFrequency = useWatch({ control, name: 'purchaseFrequency' });

  const { data: categories = [] } = useFindManyCategories();

  const showVendorCreator = Boolean(vendorCreatorDraft) && !vendorId;

  const createOneProduct = useCreateOneProduct({
    onSuccess: () => {
      toaster.create({
        type: 'success',
        title: 'Product added to hub list',
      });
      onSubmitSuccess();
    },
    onError: (error) => {
      toaster.create({
        type: 'error',
        title: error.message,
      });
    },
  });

  const onSubmit = (values: AddItemNewProductParsedValues): void => {
    createOneProduct.mutate({
      name: values.name,
      brandName: values.brandName,
      categoryId: values.categoryId,
      vendorId: values.vendorId,
      purchaseFrequency: values.purchaseFrequency,
      customFrequencyDays:
        values.purchaseFrequency === HubInventoryProductFrequency.CUSTOM
          ? values.customFrequencyDays
          : null,
      quantityInStock: values.quantityInStock,
      priority: listItemContext.priority,
      quantity: listItemContext.quantity,
      notes: listItemContext.notes,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="4" align="stretch">
        <Field.Root invalid={formState.errors.name !== undefined}>
          <Field.Label textStyle="fieldLabel">Name</Field.Label>
          <Input {...register('name')} shape="pill" />
          <Field.ErrorText>{formState.errors.name?.message}</Field.ErrorText>
        </Field.Root>

        {categories.length === 0 ? (
          <Field.Root>
            <Field.Label textStyle="fieldLabel">Category</Field.Label>
            <Input shape="pill" disabled placeholder="Loading categories..." />
          </Field.Root>
        ) : (
          <CategoryAutocomplete
            label="Category"
            items={categories}
            value={categoryId}
            onChange={(id) => {
              setValue('categoryId', id);
            }}
            placeholder="Search categories..."
          />
        )}

        <Field.Root>
          <Field.Label textStyle="fieldLabel">Brand (optional)</Field.Label>
          <Controller
            name="brandName"
            control={control}
            render={({ field }) => (
              <Input
                shape="pill"
                value={field.value ?? ''}
                onChange={(event) => {
                  const next = event.target.value;
                  field.onChange(next === '' ? null : next);
                }}
              />
            )}
          />
        </Field.Root>

        <Stack gap="2" align="stretch">
          <VendorAutocomplete
            label="Vendor"
            value={vendorId}
            onChange={(id) => {
              setValue('vendorId', id);
              setVendorCreatorDraft(null);
            }}
            onNoResults={(text) => {
              setVendorCreatorDraft(text);
            }}
            placeholder="Search vendors..."
          />
          {showVendorCreator && vendorCreatorDraft != null ? (
            <InlineVendorCreator
              draftName={vendorCreatorDraft}
              onDraftNameChange={(name) => {
                setVendorCreatorDraft(name);
              }}
              onVendorCreated={(newVendorId) => {
                setValue('vendorId', newVendorId);
                setVendorCreatorDraft(null);
              }}
            />
          ) : null}
        </Stack>

        <Field.Root invalid={formState.errors.purchaseFrequency !== undefined}>
          <Field.Label textStyle="fieldLabel">How often?</Field.Label>
          <Controller
            name="purchaseFrequency"
            control={control}
            render={({ field }) => (
              <NativeSelect.Root size="md" variant="outline" w="full">
                <NativeSelect.Field
                  borderRadius="full"
                  borderColor="border.primary"
                  bg="bg.primary"
                  value={field.value}
                  onChange={(event) => {
                    field.onChange(event.target.value);
                  }}
                >
                  {HUB_INVENTORY_FREQUENCY_UI_ORDER.map((value) => (
                    <option key={value} value={value}>
                      {HUB_INVENTORY_FREQUENCY_LABEL[value]}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            )}
          />
          <Field.ErrorText>{formState.errors.purchaseFrequency?.message}</Field.ErrorText>
        </Field.Root>

        {purchaseFrequency === HubInventoryProductFrequency.CUSTOM ? (
          <Field.Root invalid={formState.errors.customFrequencyDays !== undefined}>
            <Field.Label textStyle="fieldLabel">Custom frequency (days)</Field.Label>
            <Controller
              name="customFrequencyDays"
              control={control}
              render={({ field }) => (
                <Input
                  shape="pill"
                  type="number"
                  min={1}
                  step={1}
                  value={
                    typeof field.value === 'string' || typeof field.value === 'number'
                      ? field.value
                      : ''
                  }
                  onChange={field.onChange}
                />
              )}
            />
            <Field.ErrorText>{formState.errors.customFrequencyDays?.message}</Field.ErrorText>
          </Field.Root>
        ) : null}

        <Field.Root invalid={formState.errors.quantityInStock !== undefined}>
          <Field.Label textStyle="fieldLabel">Qty in stock</Field.Label>
          <Input {...register('quantityInStock')} shape="pill" type="number" min={0} step="any" />
          <Field.ErrorText>{formState.errors.quantityInStock?.message}</Field.ErrorText>
        </Field.Root>

        <Button
          type="submit"
          w="full"
          size="lg"
          shape="pill"
          variant="solid"
          mt="2"
          loading={createOneProduct.isPending}
        >
          Create &amp; add to list
        </Button>
      </Stack>
    </form>
  );
}
