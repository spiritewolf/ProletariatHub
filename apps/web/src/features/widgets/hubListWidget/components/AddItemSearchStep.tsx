import {
  Box,
  Button,
  Field,
  HStack,
  IconButton,
  Input,
  Separator,
  Stack,
  Text,
} from '@chakra-ui/react';
import type { HubInventoryProduct } from '@proletariat-hub/types';
import { HubListItemPriority } from '@proletariat-hub/types';
import { useDebounced } from '@proletariat-hub/web/shared/hooks';
import { trpc, useCreateOneListItem } from '@proletariat-hub/web/shared/trpc';
import { toaster } from '@proletariat-hub/web/shared/ui';
import { parsePositiveInt } from '@proletariat-hub/web/shared/utils/parsePositiveInt';
import { Plus, Search, X } from 'lucide-react';
import type { ReactElement } from 'react';

import { PriorityPillSelect } from './PriorityPillSelect';
import { ProductSearchResultList } from './ProductSearchResultList';

const SEARCH_DEBOUNCE_MS = 300;
const MIN_SEARCH_CHARS = 2;
const QTY_INPUT_WIDTH = '48px';

type AddItemSearchStepProps = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  listQuantity: number;
  onListQuantityChange: (value: number) => void;
  listPriority: HubListItemPriority;
  onListPriorityChange: (value: HubListItemPriority) => void;
  listNotes: string | null;
  onListNotesChange: (value: string | null) => void;
  selectedProduct: HubInventoryProduct | null;
  onSelectProduct: (product: HubInventoryProduct) => void;
  onClearSelectedProduct: () => void;
  onCreateNew: () => void;
  onAddedToList: () => void;
};

export function AddItemSearchStep({
  searchQuery,
  onSearchQueryChange,
  listQuantity,
  onListQuantityChange,
  listPriority,
  onListPriorityChange,
  listNotes,
  onListNotesChange,
  selectedProduct,
  onSelectProduct,
  onClearSelectedProduct,
  onCreateNew,
  onAddedToList,
}: AddItemSearchStepProps): ReactElement {
  const debouncedQuery = useDebounced(searchQuery, SEARCH_DEBOUNCE_MS);

  const searchTextForApi = debouncedQuery.length < MIN_SEARCH_CHARS ? undefined : debouncedQuery;

  const productsQuery = trpc.hubInventory.findManyProducts.useQuery({
    searchText: searchTextForApi,
  });

  const products = productsQuery.data ?? [];

  const hasMinSearchLength = debouncedQuery.length >= MIN_SEARCH_CHARS;
  const showResults = hasMinSearchLength && !selectedProduct;

  const createListItem = useCreateOneListItem({
    onSuccess: () => {
      toaster.create({
        type: 'success',
        title: 'Added to list',
      });
      onAddedToList();
    },
    onError: (error) => {
      toaster.create({
        type: 'error',
        title: error.message,
      });
    },
  });

  const onAddToList = (): void => {
    if (!selectedProduct) {
      return;
    }
    createListItem.mutate({
      productId: selectedProduct.id,
      priority: listPriority,
      quantity: listQuantity,
      notes: listNotes,
    });
  };

  return (
    <Stack gap="4" align="stretch">
      <HStack gap="3" align="flex-start" w="full">
        <Field.Root w={QTY_INPUT_WIDTH} flexShrink={0}>
          <Field.Label fontSize="xs" fontWeight="medium" color="text.secondary">
            Qty
          </Field.Label>
          <Input
            shape="pill"
            type="number"
            min={1}
            step={1}
            value={listQuantity}
            onChange={(event) => {
              onListQuantityChange(parsePositiveInt(event.target.value, 1));
            }}
          />
        </Field.Root>
        <Field.Root flex="1" minW={0}>
          <Field.Label fontSize="xs" fontWeight="medium" color="text.secondary">
            {!selectedProduct ? 'Search or add a product' : 'Product'}
          </Field.Label>
          {!selectedProduct ? (
            <Box position="relative" w="full">
              <Box
                position="absolute"
                left="3.5"
                top="50%"
                transform="translateY(-50%)"
                color="text.secondary"
                pointerEvents="none"
                lineHeight={0}
                zIndex={1}
                aria-hidden
              >
                <Search size={18} strokeWidth={2} />
              </Box>
              <Input
                value={searchQuery}
                onChange={(event) => {
                  onSearchQueryChange(event.target.value);
                }}
                placeholder="Search products..."
                shape="pill"
                pl="10"
                pr="3.5"
              />
            </Box>
          ) : (
            <Box
              display="flex"
              alignItems="center"
              gap="2"
              borderRadius="full"
              borderWidth="1px"
              borderColor="success.fg"
              bg="success.subtle"
              px="3.5"
              py="2"
              minH="10"
            >
              <Text fontSize="sm" fontWeight="medium" color="text.primary" flex="1" lineClamp={1}>
                {selectedProduct.name}
              </Text>
              {selectedProduct.brandName ? (
                <Text fontSize="xs" color="text.secondary" flexShrink={0} lineClamp={1}>
                  {selectedProduct.brandName}
                </Text>
              ) : null}
              <IconButton
                type="button"
                aria-label="Clear product"
                variant="ghost"
                size="xs"
                flexShrink={0}
                colorPalette="gray"
                onClick={() => {
                  onClearSelectedProduct();
                }}
              >
                <X size={16} strokeWidth={2} />
              </IconButton>
            </Box>
          )}
        </Field.Root>
      </HStack>

      {showResults ? (
        <Stack gap="3" align="stretch">
          {productsQuery.isFetching ? <Text textStyle="helperText">Searching…</Text> : null}
          {!productsQuery.isFetching && products.length === 0 ? (
            <Text textStyle="helperText">No products found</Text>
          ) : null}
          {products.length > 0 ? (
            <ProductSearchResultList products={products} onSelectProduct={onSelectProduct} />
          ) : null}

          <Button
            type="button"
            variant="ghost"
            justifyContent="flex-start"
            h="auto"
            py="2"
            px="0"
            color="accent.primary"
            onClick={onCreateNew}
          >
            <HStack gap="2">
              <Plus size={18} strokeWidth={2} aria-hidden />
              <Text as="span" fontSize="sm" fontWeight="medium">
                Create &quot;{searchQuery}&quot; as new product
              </Text>
            </HStack>
          </Button>
        </Stack>
      ) : null}

      {!showResults && !selectedProduct && !hasMinSearchLength ? (
        <Text textStyle="helperText">Type at least two characters to search inventory.</Text>
      ) : null}

      <Separator borderColor="border.primary" />

      <Field.Root>
        <Field.Label textStyle="fieldLabel">Priority</Field.Label>
        <PriorityPillSelect value={listPriority} onChange={onListPriorityChange} />
      </Field.Root>

      <Field.Root>
        <Field.Label textStyle="fieldLabel">Notes (optional)</Field.Label>
        <Input
          shape="pill"
          placeholder="e.g. Oatly barista edition"
          value={listNotes ?? ''}
          onChange={(event) => {
            const next = event.target.value;
            onListNotesChange(next === '' ? null : next);
          }}
        />
      </Field.Root>

      <Button
        type="button"
        w="full"
        size="lg"
        shape="pill"
        variant="solid"
        colorPalette={selectedProduct ? 'brandPalette' : 'disabledPalette'}
        loading={createListItem.isPending}
        disabled={!selectedProduct}
        onClick={onAddToList}
      >
        Add to list
      </Button>
    </Stack>
  );
}
