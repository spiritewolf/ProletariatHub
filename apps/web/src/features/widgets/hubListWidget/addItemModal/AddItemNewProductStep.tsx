import { Button, Stack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { HubInventoryProductFrequency } from '@proletariat-hub/types';
import { useCreateOneProduct, useFindManyCategories } from '@proletariat-hub/web/shared/trpc';
import {
  ComboBoxWithLabel,
  InputWithLabel,
  NativeSelectWithLabel,
  toaster,
} from '@proletariat-hub/web/shared/ui';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import {
  type AddItemNewProductFormInputValues,
  addItemNewProductFormSchema,
  type AddItemNewProductFormValues,
  HUB_INVENTORY_FREQUENCY_LABEL,
} from '../types';
import { InlineVendorCreator } from './InlineVendorCreator';
import { VendorAutocomplete } from './VendorAutocomplete';

type AddItemNewProductStepProps = {
  initialName: string;
  onSubmitSuccess: () => void;
};

const HUB_INVENTORY_FREQUENCY_UI_ORDER: HubInventoryProductFrequency[] = [
  HubInventoryProductFrequency.ONE_TIME,
  HubInventoryProductFrequency.WEEKLY,
  HubInventoryProductFrequency.BIWEEKLY,
  HubInventoryProductFrequency.MONTHLY,
  HubInventoryProductFrequency.CUSTOM,
];

export function AddItemNewProductStep({
  initialName,
  onSubmitSuccess,
}: AddItemNewProductStepProps): ReactElement {
  const [vendorSearchText, setVendorSearchText] = useState<string | null>(null);

  const formMethods = useForm<
    AddItemNewProductFormInputValues,
    undefined,
    AddItemNewProductFormValues
  >({
    resolver: zodResolver(addItemNewProductFormSchema),
    defaultValues: {
      name: initialName,
      purchaseFrequency: HubInventoryProductFrequency.ONE_TIME,
      customFrequencyDays: null,
      quantityInStock: 0,
    },
  });

  const { register, control, handleSubmit, setValue, formState } = formMethods;

  const vendorId = useWatch({ control, name: 'vendorId' });
  const purchaseFrequency = useWatch({ control, name: 'purchaseFrequency' });

  const { data: categories = [] } = useFindManyCategories();

  const createOneProduct = useCreateOneProduct({
    onSuccess: () => {
      toaster.create({
        type: 'success',
        title: 'Product successfully added to Hub Inventory!',
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

  const onSubmit = (values: AddItemNewProductFormValues): void => {
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
      notes: values.notes ?? null,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="4" align="stretch">
        <InputWithLabel
          isRootInvalid={formState.errors.name !== undefined}
          inputLabel="Name"
          inputPlaceholder="Diet Soda"
          registerMethods={register('name')}
          errorMessage={formState.errors.name?.message}
        />

        <ComboBoxWithLabel<AddItemNewProductFormInputValues>
          control={control}
          name="categoryId"
          fieldLabel="Category"
          initialItems={categories.map((c) => ({ value: c.id, label: c.name }))}
          inputPlaceholder="Search categories..."
          errorMessage={formState.errors.categoryId?.message}
          emptyText="No matches"
        />

        <InputWithLabel
          isRootInvalid={formState.errors.name !== undefined}
          inputLabel="Brand Name (optional)"
          inputPlaceholder="Palestine Cola"
          registerMethods={register('brandName')}
          errorMessage={formState.errors.name?.message}
        />

        <Stack gap="2" align="stretch">
          <VendorAutocomplete
            label="Vendor"
            value={vendorId}
            onChange={(id) => {
              setValue('vendorId', id);
              setVendorSearchText(null);
            }}
            onNoResults={(text) => {
              setVendorSearchText(text);
            }}
            placeholder="Search vendors..."
          />
          {vendorSearchText && !vendorId ? (
            <InlineVendorCreator
              draftName={vendorSearchText}
              onDraftNameChange={(name) => {
                setVendorSearchText(name);
              }}
              onVendorCreated={(newVendorId) => {
                setValue('vendorId', newVendorId);
                setVendorSearchText(null);
              }}
            />
          ) : null}
        </Stack>

        <NativeSelectWithLabel<AddItemNewProductFormInputValues>
          control={control}
          name="purchaseFrequency"
          fieldLabel="Purchase Frequency"
          options={HUB_INVENTORY_FREQUENCY_UI_ORDER.map((value) => ({
            value,
            label: HUB_INVENTORY_FREQUENCY_LABEL[value],
          }))}
          errorMessage={formState.errors.purchaseFrequency?.message}
        />

        {purchaseFrequency === HubInventoryProductFrequency.CUSTOM ? (
          <InputWithLabel
            isRootInvalid={formState.errors.customFrequencyDays !== undefined}
            inputLabel="Custom Frequency in Days"
            inputPlaceholder="7"
            inputType="number"
            registerMethods={register('customFrequencyDays')}
            errorMessage={formState.errors.customFrequencyDays?.message}
          />
        ) : null}

        <InputWithLabel
          isRootInvalid={formState.errors.quantityInStock !== undefined}
          inputLabel="Current Qty In Stock"
          inputPlaceholder="0"
          inputMin={0}
          inputStep="any"
          inputType="number"
          registerMethods={register('quantityInStock')}
          errorMessage={formState.errors.quantityInStock?.message}
        />

        <InputWithLabel
          isRootInvalid={formState.errors.notes !== undefined}
          inputLabel="Notes (optional)"
          inputPlaceholder="If out of stock, go with Aldi brand diet cola"
          registerMethods={register('notes')}
          errorMessage={formState.errors.notes?.message}
        />

        <Button
          type="submit"
          w="full"
          size="lg"
          shape="pill"
          variant="solid"
          mt="2"
          loading={createOneProduct.isPending}
        >
          Create New Product
        </Button>
      </Stack>
    </form>
  );
}
