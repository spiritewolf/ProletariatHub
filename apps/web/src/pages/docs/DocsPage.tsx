import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

import { AppPath } from '../../appPaths';
import { useAuth } from '../../auth/AuthContext';
import { dashboardTheme } from '../../dashboard/dashboardTheme';
import { AuthenticatedShell } from '../../dashboard/shell/AuthenticatedShell';
import { PageChromeTopBar } from '../../dashboard/shell/PageChromeTopBar';
import { DocsContactsTab } from './DocsContactsTab';
import { DocsPageCopy } from './docsCopy';
import { DocsCredentialsTab } from './DocsCredentialsTab';
import { DocsNotesTab } from './DocsNotesTab';
import { DocsServicesTab } from './DocsServicesTab';
import { DocsTab } from './docsTab';

export function DocsPage() {
  const { authenticatedComrade } = useAuth();
  const [tab, setTab] = useState<DocsTab>(DocsTab.NOTES);
  const [banner, setBanner] = useState<string | null>(null);
  const isAdmin = authenticatedComrade?.isAdmin ?? false;

  if (!authenticatedComrade) {
    return <Navigate to={AppPath.Login} replace />;
  }
  if (authenticatedComrade.mustChangePassword) {
    return <Navigate to={AppPath.ChangePassword} replace />;
  }
  if (authenticatedComrade.isAdmin && !authenticatedComrade.hasCompletedSetup) {
    return <Navigate to={AppPath.Setup} replace />;
  }

  return (
    <AuthenticatedShell topBar={<PageChromeTopBar title={DocsPageCopy.title} />}>
      <Box maxW="42rem" w="100%" mx="auto" px={2} py={3}>
        {banner ? (
          <Text fontSize="10px" color="red.600" mb={2}>
            {banner}
          </Text>
        ) : null}

        <Flex gap={1} flexWrap="wrap" mb={3}>
          {(
            [
              [DocsTab.NOTES, DocsPageCopy.tabNotes],
              [DocsTab.CREDENTIALS, DocsPageCopy.tabPasswords],
              [DocsTab.CONTACTS, DocsPageCopy.tabContacts],
              ...(isAdmin ? ([[DocsTab.SERVICES, DocsPageCopy.tabServices]] as const) : []),
            ] as const
          ).map(([value, label]) => (
            <Button
              key={value}
              type="button"
              size="xs"
              fontSize="9px"
              h="22px"
              variant={tab === value ? 'solid' : 'outline'}
              bg={tab === value ? dashboardTheme.title : 'transparent'}
              color={tab === value ? 'white' : dashboardTheme.title}
              borderColor={dashboardTheme.cardBorder}
              onClick={() => {
                setTab(value);
                setBanner(null);
              }}
            >
              {label}
            </Button>
          ))}
        </Flex>

        {tab === DocsTab.NOTES ? <DocsNotesTab onBanner={setBanner} /> : null}
        {tab === DocsTab.CREDENTIALS ? <DocsCredentialsTab onBanner={setBanner} /> : null}
        {tab === DocsTab.CONTACTS ? <DocsContactsTab onBanner={setBanner} /> : null}
        {tab === DocsTab.SERVICES && isAdmin ? <DocsServicesTab onBanner={setBanner} /> : null}
      </Box>
    </AuthenticatedShell>
  );
}
