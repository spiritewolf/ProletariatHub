import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react';
import { Plus, SquareCheckBig } from 'lucide-react';
import type { ReactElement } from 'react';

type HubListWidgetHeaderProps = {
  activeCount: number;
  onAddClick: () => void;
};

export function HubListWidgetHeader({
  activeCount,
  onAddClick,
}: HubListWidgetHeaderProps): ReactElement {
  return (
    <Flex
      align="center"
      justify="space-between"
      gap="3"
      flexShrink={0}
      pb="3"
      borderBottomWidth="1px"
      borderColor="hubList.border"
    >
      <HStack gap="3" minW="0">
        <Box color="accent.primary" display="flex" alignItems="center" aria-hidden>
          <SquareCheckBig size={22} strokeWidth={1.75} />
        </Box>
        <Text color="text.primary" fontWeight="semibold" fontSize="md" lineClamp={1}>
          Hub List
        </Text>
        <Text textStyle="helperText" flexShrink={0}>
          {activeCount} active
        </Text>
      </HStack>
      <HStack gap="2" flexShrink={0}>
        <Button variant="ghost" size="sm" color="accent.primary" onClick={onAddClick}>
          <HStack gap="1">
            <Plus size={16} strokeWidth={2} aria-hidden />
            <Text>Add</Text>
          </HStack>
        </Button>
        <Button variant="ghost" size="sm" color="accent.primary" onClick={() => {}}>
          View all
        </Button>
      </HStack>
    </Flex>
  );
}
