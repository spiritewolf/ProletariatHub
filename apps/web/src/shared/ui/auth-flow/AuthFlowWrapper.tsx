import { Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';

type AuthFlowWrapperProps = {
  children: ReactNode;
};

export function AuthFlowWrapper({ children }: AuthFlowWrapperProps): React.ReactElement {
  return (
    <Box minH="100vh" bg="bg.dark" color="text.primary" py={{ base: 8, md: 12 }} px={4}>
      <Box maxW="28rem" mx="auto" w="100%">
        <Box as="main">{children}</Box>
      </Box>
    </Box>
  );
}
