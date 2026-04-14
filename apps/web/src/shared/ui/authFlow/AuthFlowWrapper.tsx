import { Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import { AuthFlowHeader } from './AuthFlowHeader';

type AuthFlowWrapperProps = {
  children: ReactNode;
  subtitle?: string;
  progressFill?: number;
  progressTotal?: number;
};

export function AuthFlowWrapper({
  children,
  subtitle,
  progressFill,
  progressTotal,
}: AuthFlowWrapperProps): React.ReactElement {
  const showAuthHeader = subtitle && progressFill && progressTotal;

  if (showAuthHeader) {
    return (
      <Box maxW="28rem" mx="auto" w="100%">
        <AuthFlowHeader
          subtitle={subtitle}
          progressFill={progressFill}
          progressTotal={progressTotal}
        />
        <Box as="main">{children}</Box>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="bg.dark" color="text.primary" py={{ base: 8, md: 12 }} px={4}>
      <Box maxW="28rem" mx="auto" w="100%">
        {showAuthHeader ? (
          <AuthFlowHeader
            subtitle={subtitle}
            progressFill={progressFill}
            progressTotal={progressTotal}
          />
        ) : null}
        <Box as="main">{children}</Box>
      </Box>
    </Box>
  );
}
