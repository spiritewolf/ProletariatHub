import { Box, Button, Flex, HStack, Stack, Text } from '@chakra-ui/react';
import { toaster } from '@proletariat-hub/web/shared/ui';
import { Check } from 'lucide-react';
import type { ReactElement } from 'react';

import type { MockProduct } from '../mockCatalog';

type AddItemExistingProductStepProps = {
  product: MockProduct;
  onSubmitSuccess: () => void;
};

export function AddItemExistingProductStep({
  product,
  onSubmitSuccess,
}: AddItemExistingProductStepProps): ReactElement {
  const onAdd = (): void => {
    toaster.create({
      type: 'success',
      title: 'Added to list',
      description: `${product.name} (mock).`,
    });
    onSubmitSuccess();
  };

  return (
    <Stack gap="5" align="stretch">
      <Box borderWidth="1px" borderColor="border.primary" borderRadius="md" bg="bg.secondary" p="4">
        <HStack gap="3" align="flex-start">
          <Flex
            align="center"
            justify="center"
            boxSize="10"
            borderRadius="full"
            bg="success.subtle"
            color="success.fg"
            flexShrink={0}
            aria-hidden
          >
            <Check size={22} strokeWidth={2.5} />
          </Flex>
          <Stack gap="1" align="flex-start" flex="1" minW="0">
            <Text fontSize="md" fontWeight="medium" color="text.primary" lineClamp={2}>
              {product.name}
            </Text>
            <Text fontSize="sm" color="text.secondary">
              {[product.brand, product.vendorName].filter(Boolean).join(' · ') || '—'}
            </Text>
            <HStack gap="2" flexWrap="wrap" mt="1">
              {product.category !== null ? (
                <Text fontSize="xs" color="text.secondary">
                  {product.category}
                </Text>
              ) : null}
              <Text fontSize="xs" color="text.secondary">
                {product.frequency}
              </Text>
            </HStack>
          </Stack>
        </HStack>
      </Box>

      <Button
        type="button"
        w="full"
        size="lg"
        borderRadius="full"
        colorPalette="brandPalette"
        variant="solid"
        onClick={onAdd}
      >
        Add to list
      </Button>
    </Stack>
  );
}
