import { Box, Button, Field, Flex, HStack, Input, Stack, Text } from '@chakra-ui/react';
import { Plus, Search } from 'lucide-react';
import type { ReactElement } from 'react';

import { getCategoryBadgeStyle } from '../categoryBadgeStyles';
import { getCategorySearchResultIcon } from '../categorySearchResultIcons';
import type { MockProduct } from '../mockCatalog';
import { MOCK_PRODUCT_CATALOG } from '../mockCatalog';

type AddItemSearchStepProps = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSelectProduct: (product: MockProduct) => void;
  onCreateNew: () => void;
};

export function AddItemSearchStep({
  searchQuery,
  onSearchQueryChange,
  onSelectProduct,
  onCreateNew,
}: AddItemSearchStepProps): ReactElement {
  const trimmed = searchQuery.trim();
  const queryLower = trimmed.toLowerCase();
  const filtered =
    trimmed.length === 0
      ? []
      : MOCK_PRODUCT_CATALOG.filter((p) => p.name.toLowerCase().includes(queryLower));

  return (
    <Stack gap="4" align="stretch">
      <Field.Root>
        <Field.Label fontSize="xs" fontWeight="medium" color="text.secondary">
          Search or add a product
        </Field.Label>
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
            onChange={(e) => {
              onSearchQueryChange(e.target.value);
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
      </Field.Root>

      {trimmed.length === 0 ? (
        <Text fontSize="sm" color="text.secondary">
          Start typing to search the catalog.
        </Text>
      ) : (
        <Stack gap="3" align="stretch">
          {filtered.length === 0 ? (
            <Text fontSize="sm" color="text.secondary">
              No products found
            </Text>
          ) : (
            <Box
              borderWidth="1px"
              borderColor="border.primary"
              borderRadius="md"
              overflow="hidden"
              maxH="48"
              overflowY="auto"
            >
              <Stack gap="0">
                {filtered.map((product, index) => {
                  const categoryBadgeStyle =
                    product.category !== null ? getCategoryBadgeStyle(product.category) : null;
                  const CategoryIcon = getCategorySearchResultIcon(product.category);
                  return (
                    <Button
                      key={product.id}
                      type="button"
                      variant="ghost"
                      justifyContent="flex-start"
                      h="auto"
                      py="3"
                      px="3"
                      borderRadius="0"
                      borderBottomWidth={index < filtered.length - 1 ? '1px' : undefined}
                      borderColor="hubList.border"
                      onClick={() => {
                        onSelectProduct(product);
                      }}
                    >
                      <HStack gap="3" align="flex-start" w="full" minW="0">
                        <Flex
                          align="center"
                          justify="center"
                          boxSize="9"
                          borderRadius="sm"
                          borderWidth="1px"
                          borderColor="accent.primary"
                          color="accent.primary"
                          flexShrink={0}
                          aria-hidden
                        >
                          <CategoryIcon size={18} strokeWidth={1.75} />
                        </Flex>
                        <Stack gap="0.5" align="flex-start" flex="1" minW="0">
                          <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color="text.primary"
                            lineClamp={2}
                            textAlign="start"
                          >
                            {product.name}
                          </Text>
                          <HStack gap="3" flexWrap="wrap" align="baseline" w="full">
                            {product.brand !== null ? (
                              <Text as="span" fontSize="xs" color="text.secondary" lineClamp={1}>
                                {product.brand}
                              </Text>
                            ) : null}
                            {product.vendorName !== null ? (
                              <Text as="span" fontSize="xs" color="text.primary" lineClamp={1}>
                                {product.vendorName}
                              </Text>
                            ) : null}
                          </HStack>
                        </Stack>
                        {categoryBadgeStyle !== null ? (
                          <Text
                            as="span"
                            fontSize="xs"
                            fontWeight="medium"
                            px="2"
                            py="0.5"
                            borderRadius="full"
                            flexShrink={0}
                            bg={categoryBadgeStyle.bg}
                            color={categoryBadgeStyle.color}
                          >
                            {product.category}
                          </Text>
                        ) : null}
                      </HStack>
                    </Button>
                  );
                })}
              </Stack>
            </Box>
          )}

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
                Create &quot;{trimmed}&quot; as new product
              </Text>
            </HStack>
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
