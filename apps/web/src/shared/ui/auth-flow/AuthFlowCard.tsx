import { Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';

type AuthFlowCardProps = {
  children: ReactNode;
};

export function AuthFlowCard({ children }: AuthFlowCardProps): React.ReactElement {
  return (
    <Box
      bg="bg.secondary"
      borderRadius="xl"
      borderWidth="1px"
      borderColor="border.primary"
      // boxShadow="0 12px 40px rgba(128, 21, 48, 0.08)"
      p={{ base: 6, md: 8 }}
    >
      {children}
    </Box>
  );
}
