import { Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import { flowPalette } from '../../../styles/flow-theme';

type FlowCardProps = {
  children: ReactNode;
};

export function FlowCard({ children }: FlowCardProps): React.ReactElement {
  return (
    <Box
      bg={flowPalette.cardBg}
      borderRadius="xl"
      borderWidth="1px"
      borderColor={flowPalette.border}
      boxShadow="0 12px 40px rgba(128, 21, 48, 0.08)"
      p={{ base: 6, md: 8 }}
    >
      {children}
    </Box>
  );
}
