import { Button, Field, HStack, Separator, Stack, Text } from '@chakra-ui/react';
import { HubInventoryProduct, HubListItemPriority } from '@proletariat-hub/types';
import { useSearchState } from '@proletariat-hub/web/shared/hooks';
import { trpc } from '@proletariat-hub/web/shared/trpc';
import { ComboBoxWithLabel, InputWithLabel } from '@proletariat-hub/web/shared/ui';
import { Plus } from 'lucide-react';
import { type ReactElement } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { PriorityPillSelect } from '../components/PriorityPillSelect';
import { AddHubListItemFormValues } from './AddItemModal';

function createProductLabel(product: HubInventoryProduct): string {
  let baseText = product.name;
  if (product.brandName) {
    baseText += ` (${product.brandName})`;
  }
  if (product.vendorName) {
    baseText += ` - ${product.vendorName}`;
  }
  return baseText;
}

export function AddListItemStep({
  onCreateNew,
}: {
  onCreateNew: (productName: string) => void;
}): ReactElement {
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<AddHubListItemFormValues>();
  const { searchTextDebounced, setSearchText, searchText } = useSearchState({
    defaultSearchText: '',
    debounceMs: 300,
  });

  const selectedProductId = useWatch({ control, name: 'productId' });
  const hubListItemPriority = useWatch({ control, name: 'priority' });

  const productsQuery = trpc.hubInventory.findManyProducts.useQuery({
    searchText: searchTextDebounced.length > 1 ? searchTextDebounced : undefined,
  });

  const hubInventoryProducts = productsQuery.data ?? [];

  const onCreateNewProduct = (): void => {
    onCreateNew(searchText);
  };

  const initialItems = hubInventoryProducts.map((p) => ({
    value: p.id,
    label: createProductLabel(p),
  }));

  return (
    <Stack gap="4" align="stretch">
      <HStack gap="3" w="full">
        <InputWithLabel
          rootWidth={'48px'}
          rootFlexShrink={0}
          inputLabel="Qty"
          inputType="number"
          inputMin={1}
          inputStep={1}
          inputPadding="1"
          registerMethods={register('quantity')}
          errorMessage={errors.quantity?.message}
        />
        <ComboBoxWithLabel<AddHubListItemFormValues>
          control={control}
          name="productId"
          fieldLabel="Product"
          initialItems={initialItems}
          inputPlaceholder="Search products..."
          onInputValueChange={setSearchText}
          errorMessage={errors.productId?.message}
          emptyComponent={
            <Button
              type="button"
              variant="ghost"
              justifyContent="flex-start"
              h="auto"
              py="2"
              px="0"
              color="accent.primary"
              onClick={onCreateNewProduct}
            >
              <HStack gap="2">
                <Plus size={18} strokeWidth={2} aria-hidden />
                <Text as="span" fontSize="sm" fontWeight="medium">
                  Create &quot;{searchText}&quot; as new product
                </Text>
              </HStack>
            </Button>
          }
          emptyText="No products found"
        />
      </HStack>

      <Separator borderColor="border.primary" />

      <Field.Root>
        <Field.Label textStyle="fieldLabel">Priority</Field.Label>
        <PriorityPillSelect
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          value={hubListItemPriority as HubListItemPriority}
          onChange={(priority) => setValue('priority', priority)}
        />
      </Field.Root>

      <InputWithLabel
        inputLabel="Notes (optional)"
        inputPlaceholder="e.x. Oatly Barista Edition"
        registerMethods={register('notes')}
        errorMessage={errors.notes?.message}
      />

      <Button
        type="submit"
        w="full"
        size="lg"
        shape="pill"
        variant="solid"
        colorPalette={selectedProductId ? 'brandPalette' : 'disabledPalette'}
        disabled={!selectedProductId}
      >
        Add to list
      </Button>
    </Stack>
  );
}
