import { Stack, Text } from '@chakra-ui/react';
import { useAuth } from '@proletariat-hub/web/shared/hooks/auth/useAuth';
import type { ReactElement } from 'react';

import { SetupWizardContent } from './SetupWizardContent';
import { SetupWizardProvider } from './SetupWizardProvider';

export function SetupWizardPage(): ReactElement {
  const { comrade } = useAuth();
  if (!comrade) {
    return (
      <Stack>
        <Text>You are not authorized to access this page</Text>
      </Stack>
    );
  }
  return (
    <SetupWizardProvider key={comrade.id}>
      <SetupWizardContent />
    </SetupWizardProvider>
  );
}
