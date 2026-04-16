import { Button, Field, Input, NativeSelect, Stack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { HubInventoryProductFrequency, HubListItemPriority } from '@proletariat-hub/types';
import { useCreateOneProduct, useFindManyCategories, useFindManyVendors } from '@proletariat-hub/web/shared/trpc';
import { toaster } from '@proletariat-hub/web/shared/ui';
import type { ReactElement } from 'react';
import { useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { PILL_INPUT_PROPS } from '../constants';
import {
  addItemNewProductFormSchema,
  type AddItemNewProductFormValues,
  type AddItemNewProductParsedValues,
  HUB_INVENTORY_FREQUENCY_LABEL,
} from '../types';
import type { AutocompleteSelectItem } from './AutocompleteSelect';
import { AutocompleteSelect } from './AutocompleteSelect';
import { InlineVendorCreator } from './InlineVendorCreator';

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
  const { data: categories } = useFindManyCategories();
  const { data: vendors } = useFindManyVendors();
  const [vendorSearchText, setVendorSearchText] = useState('');

  const categoryItems: AutocompleteSelectItem[] = useMemo(
    () => categories.map((c) => ({ id: c.id, name: c.name })),
    [categories],
  );
  const vendorItems: AutocompleteSelectItem[] = useMemo(
    () => vendors.map((v) => ({ id: v.id, name: v.name })),
    [vendors],
  );

  const form = useForm<AddItemNewProductFormValues, unknown, AddItemNewProductParsedValues>({
    resolver: zodResolver(addItemNewProductFormSchema),
    defaultValues: buildDefaultValues(initialName),
  });

  const { register, control, handleSubmit, setValue, formState } = form;

  const categoryId = useWatch({
    control,
    name: 'categoryId',
    defaultValue: null,
  });
  const vendorId = useWatch({
    control,
    name: 'vendorId',
    defaultValue: null,
  });

  const selectedCategoryItem = useMemo((): AutocompleteSelectItem | null => {
    if (categoryId === null) {
      return null;
    }
    const category = categories.find((c) => c.id === categoryId);
    if (category === undefined) {
      return null;
    }
    return { id: category.id, name: category.name };
  }, [categoryId, categories]);

  const selectedVendorItem = useMemo((): AutocompleteSelectItem | null => {
    if (vendorId === null) {
      return null;
    }
    const vendor = vendors.find((v) => v.id === vendorId);
    if (vendor === undefined) {
      return null;
    }
    return { id: vendor.id, name: vendor.name };
  }, [vendorId, vendors]);

  const vendorMatchCount = useMemo(() => {
    const query = vendorSearchText.trim().toLowerCase();
    if (query.length < 2) {
      return 0;
    }
    return vendorItems.filter((v) => v.name.toLowerCase().includes(query)).length;
  }, [vendorSearchText, vendorItems]);

  const showVendorCreator =
    vendorSearchText.trim().length >= 2 && vendorMatchCount === 0 && selectedVendorItem === null;

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

  const purchaseFrequency = useWatch({
    control,
    name: 'purchaseFrequency',
    defaultValue: HubInventoryProductFrequency.ONE_TIME,
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
    <form
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event);
      }}
    >
      <Stack gap="4" align="stretch">
        <Field.Root invalid={formState.errors.name !== undefined}>
          <Field.Label fontSize="xs" fontWeight="medium" color="text.primary">
            Name
          </Field.Label>
          <Input {...register('name')} {...PILL_INPUT_PROPS} />
          <Field.ErrorText>{formState.errors.name?.message}</Field.ErrorText>
        </Field.Root>

        <Controller
          name="categoryId"
          control={control}
          render={() => (
            <AutocompleteSelect
              label="Category"
              items={categoryItems}
              selectedItem={selectedCategoryItem}
              onSelect={(item) => {
                setValue('categoryId', item.id);
              }}
              onClear={() => {
                setValue('categoryId', null);
              }}
              placeholder="Search categories..."
            />
          )}
        />

        <Field.Root>
          <Field.Label fontSize="xs" fontWeight="medium" color="text.primary">
            Brand (optional)
          </Field.Label>
          <Controller
            name="brandName"
            control={control}
            render={({ field }) => (
              <Input
                {...PILL_INPUT_PROPS}
                value={field.value ?? ''}
                onChange={(event) => {
                  const next = event.target.value;
                  field.onChange(next === '' ? null : next);
                }}
              />
            )}
          />
        </Field.Root>

        <Controller
          name="vendorId"
          control={control}
          render={() => (
            <>
              <AutocompleteSelect
                label="Vendor"
                items={vendorItems}
                selectedItem={selectedVendorItem}
                onSelect={(item) => {
                  setValue('vendorId', item.id);
                  setVendorSearchText('');
                }}
                onClear={() => {
                  setValue('vendorId', null);
                  setVendorSearchText('');
                }}
                placeholder="Search vendors..."
                onSearchChange={(value) => {
                  setVendorSearchText(value);
                }}
              />
              <InlineVendorCreator
                visible={showVendorCreator}
                draftName={vendorSearchText}
                onDraftNameChange={setVendorSearchText}
                onVendorCreated={(id) => {
                  setValue('vendorId', id);
                  setVendorSearchText('');
                }}
              />
            </>
          )}
        />

        <Field.Root invalid={formState.errors.purchaseFrequency !== undefined}>
          <Field.Label fontSize="xs" fontWeight="medium" color="text.primary">
            How often?
          </Field.Label>
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
            <Field.Label fontSize="xs" fontWeight="medium" color="text.primary">
              Custom frequency (days)
            </Field.Label>
            <Controller
              name="customFrequencyDays"
              control={control}
              render={({ field }) => (
                <Input
                  {...PILL_INPUT_PROPS}
                  type="number"
                  min={1}
                  step={1}
                  value={field.value ?? ''}
                  onChange={(event) => {
                    const raw = event.target.value;
                    if (raw === '') {
                      field.onChange(null);
                      return;
                    }
                    const parsed = Number.parseInt(raw, 10);
                    field.onChange(Number.isNaN(parsed) ? null : parsed);
                  }}
                />
              )}
            />
            <Field.ErrorText>{formState.errors.customFrequencyDays?.message}</Field.ErrorText>
          </Field.Root>
        ) : null}

        <Field.Root invalid={formState.errors.quantityInStock !== undefined}>
          <Field.Label fontSize="xs" fontWeight="medium" color="text.primary">
            Qty in stock
          </Field.Label>
          <Input
            {...register('quantityInStock', { valueAsNumber: true })}
            {...PILL_INPUT_PROPS}
            type="number"
            min={0}
            step="any"
          />
          <Field.ErrorText>{formState.errors.quantityInStock?.message}</Field.ErrorText>
        </Field.Root>

        <Button
          type="submit"
          w="full"
          size="lg"
          borderRadius="full"
          colorPalette="brandPalette"
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
