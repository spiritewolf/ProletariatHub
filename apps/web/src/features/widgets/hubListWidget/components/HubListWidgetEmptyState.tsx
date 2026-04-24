import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { ShoppingBag } from 'lucide-react';
import type { ReactElement } from 'react';

type HubListWidgetEmptyStateProps = {
  onAddClick: () => void;
};

export function HubListWidgetEmptyState({
  onAddClick,
}: HubListWidgetEmptyStateProps): ReactElement {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      gap="4"
      flex="1"
      px="4"
      py="8"
      textAlign="center"
    >
      <Box color="text.tertiary" display="flex" aria-hidden>
        <ShoppingBag size={48} strokeWidth={1.25} />
      </Box>
      <Text textStyle="helperText" maxW="260px">
        Your hub list is empty. Add something you need.
      </Text>
      <Button
        variant="outline"
        color="accent.primary"
        borderColor="accent.primary"
        onClick={onAddClick}
        aria-label="Add item to hub list"
      >
        Add item
      </Button>
    </Flex>
  );
}
