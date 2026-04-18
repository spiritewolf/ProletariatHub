import { Box, Button, Flex, HStack, Stack, Text } from '@chakra-ui/react';
import type { HubInventoryProduct } from '@proletariat-hub/types';
import type { ReactElement } from 'react';

import { getCategoryBadgeStyle, getCategorySearchResultIcon } from '../constants';

export type ProductSearchResultListProps = {
  products: HubInventoryProduct[];
  onSelectProduct: (product: HubInventoryProduct) => void;
};

export function ProductSearchResultList({
  products,
  onSelectProduct,
}: ProductSearchResultListProps): ReactElement {
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
        {products.map((product) => {
          const categoryBadgeStyle = product.categoryName
            ? getCategoryBadgeStyle(product.categoryName)
            : null;
          const CategoryIcon = getCategorySearchResultIcon(product.categoryName);
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
              borderColor="hubList.border"
              _notLast={{ borderBottomWidth: '1px' }}
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
                    {product.brandName ? (
                      <Text as="span" fontSize="xs" color="text.secondary" lineClamp={1}>
                        {product.brandName}
                      </Text>
                    ) : null}
                    {product.vendorName ? (
                      <Text as="span" fontSize="xs" color="text.primary" lineClamp={1}>
                        {product.vendorName}
                      </Text>
                    ) : null}
                  </HStack>
                </Stack>
                {categoryBadgeStyle ? (
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
                    {product.categoryName}
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
