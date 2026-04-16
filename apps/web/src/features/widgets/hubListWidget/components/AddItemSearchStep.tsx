import { Box, Button, Field, HStack, IconButton, Input, Separator, Stack, Text } from '@chakra-ui/react';
import type { HubInventoryProduct } from '@proletariat-hub/types';
import { HubListItemPriority } from '@proletariat-hub/types';
import { useDebounced } from '@proletariat-hub/web/shared/hooks';
import { trpc, useCreateOneListItem, useFindManyCategories, useFindManyVendors } from '@proletariat-hub/web/shared/trpc';
import { toaster } from '@proletariat-hub/web/shared/ui';
import { Plus, Search, X } from 'lucide-react';
import type { ReactElement } from 'react';

import { PILL_INPUT_PROPS } from '../constants';
import { PriorityPillSelect } from './PriorityPillSelect';
import { ProductSearchResultList } from './ProductSearchResultList';

const SEARCH_DEBOUNCE_MS = 300;
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

  const searchTextForApi =
    debouncedQuery.length === 0 || debouncedQuery.length < 2 ? null : debouncedQuery;

  const productsQuery = trpc.hubInventory.findManyProducts.useQuery({
    searchText: searchTextForApi,
  });

  const { data: categories } = useFindManyCategories();
  const { data: vendors } = useFindManyVendors();

  const products: HubInventoryProduct[] = productsQuery.data ?? [];
  const hasMinSearchLength = debouncedQuery.length >= 2;
  const showResults = hasMinSearchLength && selectedProduct === null;

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
    if (selectedProduct === null) {
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
            {...PILL_INPUT_PROPS}
            type="number"
            min={1}
            step={1}
            value={listQuantity}
            onChange={(event) => {
              const parsed = Number.parseInt(event.target.value, 10);
              if (Number.isNaN(parsed) || parsed < 1) {
                onListQuantityChange(1);
                return;
              }
              onListQuantityChange(parsed);
            }}
          />
        </Field.Root>
        <Field.Root flex="1" minW={0}>
          <Field.Label fontSize="xs" fontWeight="medium" color="text.secondary">
            {selectedProduct === null ? 'Search or add a product' : 'Product'}
          </Field.Label>
          {selectedProduct === null ? (
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
                variant="outline"
                borderRadius="full"
                py="2"
                pl="10"
                pr="3.5"
                fontSize="sm"
                borderColor="border.primary"
                bg="bg.primary"
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
              <Text fontSize="sm" fontWeight="semibold" color="text.primary" flex="1" lineClamp={1}>
                {selectedProduct.name}
              </Text>
              {selectedProduct.brandName !== null ? (
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
          {productsQuery.isFetching ? (
            <Text fontSize="sm" color="text.secondary">
              Searching…
            </Text>
          ) : null}
          {!productsQuery.isFetching && products.length === 0 ? (
            <Text fontSize="sm" color="text.secondary">
              No products found
            </Text>
          ) : null}
          {products.length > 0 ? (
            <ProductSearchResultList
              products={products}
              categories={categories}
              vendors={vendors}
              onSelectProduct={onSelectProduct}
            />
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

      {!showResults && selectedProduct === null && !hasMinSearchLength ? (
        <Text fontSize="sm" color="text.secondary">
          Type at least two characters to search inventory.
        </Text>
      ) : null}

      <Separator borderColor="border.primary" />

      <Field.Root>
        <Field.Label fontSize="xs" fontWeight="medium" color="text.primary">
          Priority
        </Field.Label>
        <PriorityPillSelect value={listPriority} onChange={onListPriorityChange} />
      </Field.Root>

      <Field.Root>
        <Field.Label fontSize="xs" fontWeight="medium" color="text.primary">
          Notes (optional)
        </Field.Label>
        <Input
          {...PILL_INPUT_PROPS}
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
        borderRadius="full"
        variant="solid"
        loading={createListItem.isPending}
        disabled={selectedProduct === null}
        cursor={selectedProduct === null ? 'not-allowed' : 'pointer'}
        onClick={onAddToList}
        colorPalette={selectedProduct === null ? 'gray' : undefined}
        color={selectedProduct === null ? undefined : 'white'}
        bgGradient={selectedProduct === null ? undefined : 'linear(to-r, pink.500, rose.500)'}
        _hover={
          selectedProduct === null
            ? undefined
            : {
                bgGradient: 'linear(to-r, pink.600, rose.600)',
              }
        }
      >
        Add to list
      </Button>
    </Stack>
  );
}
