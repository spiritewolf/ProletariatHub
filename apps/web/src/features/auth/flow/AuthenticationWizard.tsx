import { Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import { flowPalette } from '../../../styles/flow-theme';
import { WizardHeader } from './WizardHeader';

type AuthenticationWizardProps = {
  /** Shown under the logo (e.g. hub name or "the household collective"). */
  subtitle: string;
  /** 0 = hide progress bar; 1-4 = filled segments. */
  progressFill?: number;
  children: ReactNode;
  /**
   * Full-screen blush page (login). When false, only inner column — use inside DashboardShell.
   */
  layout?: 'fullscreen' | 'embedded';
};

export function AuthenticationWizard({
  subtitle,
  progressFill = 0,
  children,
  layout = 'fullscreen',
}: AuthenticationWizardProps): React.ReactElement {
  const inner = (
    <Box maxW="28rem" mx="auto" w="100%">
      <WizardHeader subtitle={subtitle} progressFill={progressFill} />
      <Box as="main">{children}</Box>
    </Box>
  );

  if (layout === 'embedded') {
    return inner;
  }

  return (
    <Box
      minH="100vh"
      bg={flowPalette.pageBg}
      color={flowPalette.text}
      py={{ base: 8, md: 12 }}
      px={4}
    >
      {inner}
    </Box>
  );
}
