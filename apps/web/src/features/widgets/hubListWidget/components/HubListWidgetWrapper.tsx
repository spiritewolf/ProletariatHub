import { Box } from '@chakra-ui/react';
import type { ReactElement, ReactNode } from 'react';

export function HubListWidgetWrapper({ children }: { children: ReactNode }): ReactElement {
  return (
    <Box
      as="section"
      aria-label="Hub shopping list"
      display="flex"
      flexDirection="column"
      h="380px"
      w="full"
      maxW="full"
      minW="0"
      bg="bg.primary"
      borderWidth="1px"
      borderColor="border.primary"
      borderRadius="l2"
      overflow="hidden"
      px="4"
      pt="4"
      pb="0"
    >
      {children}
    </Box>
  );
}
