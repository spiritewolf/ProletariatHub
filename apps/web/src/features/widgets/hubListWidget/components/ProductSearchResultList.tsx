import { Box, Button, Flex, HStack, Stack, Text } from '@chakra-ui/react';
import type {
  HubInventoryProduct,
  HubInventoryProductCategory,
  HubInventoryVendor,
} from '@proletariat-hub/types';
import type { ReactElement } from 'react';
import { useMemo } from 'react';

import { getCategoryBadgeStyle } from '../constants';
import { getCategorySearchResultIcon } from '../constants';

export type ProductSearchResultListProps = {
  products: HubInventoryProduct[];
  categories: HubInventoryProductCategory[];
  vendors: HubInventoryVendor[];
  onSelectProduct: (product: HubInventoryProduct) => void;
};

export function ProductSearchResultList({
  products,
  categories,
  vendors,
  onSelectProduct,
}: ProductSearchResultListProps): ReactElement {
  const categoryNameById = useMemo(() => {
    const nameByCategoryId = new Map<string, string>();
    for (const category of categories) {
      nameByCategoryId.set(category.id, category.name);
    }
    return nameByCategoryId;
  }, [categories]);

  const vendorNameById = useMemo(() => {
    const nameByVendorId = new Map<string, string>();
    for (const vendor of vendors) {
      nameByVendorId.set(vendor.id, vendor.name);
    }
    return nameByVendorId;
  }, [vendors]);

  return (
    <Box
      borderWidth="1px"
      borderColor="border.primary"
      borderRadius="md"
      overflow="hidden"
      maxH="48"
      overflowY="auto"
    >
      <Stack gap="0">
        {products.map((product, index) => {
          const categoryName =
            product.categoryId !== null ? (categoryNameById.get(product.categoryId) ?? null) : null;
          const vendorName =
            product.vendorId !== null ? (vendorNameById.get(product.vendorId) ?? null) : null;
          const categoryBadgeStyle =
            categoryName !== null ? getCategoryBadgeStyle(categoryName) : null;
          const CategoryIcon = getCategorySearchResultIcon(categoryName);
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
              borderBottomWidth={index < products.length - 1 ? '1px' : undefined}
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
                    {product.brandName !== null ? (
                      <Text as="span" fontSize="xs" color="text.secondary" lineClamp={1}>
                        {product.brandName}
                      </Text>
                    ) : null}
                    {vendorName !== null ? (
                      <Text as="span" fontSize="xs" color="text.primary" lineClamp={1}>
                        {vendorName}
                      </Text>
                    ) : null}
                  </HStack>
                </Stack>
                {categoryBadgeStyle !== null && categoryName !== null ? (
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
                    {categoryName}
                  </Text>
                ) : null}
              </HStack>
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
}
