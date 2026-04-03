import { Box, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { Navigate } from 'react-router';

import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageChromeTopBar } from '@/components/layout/PageChromeTopBar';
import { TabRow } from '@/components/ui/TabRow';
import { useAuth } from '@/features/auth/useAuth';
import { DocsContactsTab } from '@/features/docs/DocsContactsTab';
import { DocsPageCopy } from '@/features/docs/docsCopy';
import { DocsCredentialsTab } from '@/features/docs/DocsCredentialsTab';
import { DocsNotesTab } from '@/features/docs/DocsNotesTab';
import { DocsServicesTab } from '@/features/docs/DocsServicesTab';
import { DocsTab } from '@/features/docs/docsTab';
import { AppPath } from '@/lib/appPaths';

export default function DocsPage(): React.ReactElement {
  const { authenticatedComrade } = useAuth();
  const [tab, setTab] = useState<DocsTab>(DocsTab.NOTES);
  const [banner, setBanner] = useState<string | null>(null);
  const isAdmin = authenticatedComrade?.isAdmin ?? false;
  const tabOptions = [
    { value: DocsTab.NOTES, label: DocsPageCopy.tabNotes },
    { value: DocsTab.CREDENTIALS, label: DocsPageCopy.tabPasswords },
    { value: DocsTab.CONTACTS, label: DocsPageCopy.tabContacts },
    ...(isAdmin ? [{ value: DocsTab.SERVICES, label: DocsPageCopy.tabServices }] : []),
  ];

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
    <DashboardShell topBar={<PageChromeTopBar title={DocsPageCopy.title} />}>
      <Box maxW="42rem" w="100%" mx="auto" px={2} py={3}>
        {banner ? (
          <Text fontSize="10px" color="red.600" mb={2}>
            {banner}
          </Text>
        ) : null}

        <TabRow
          value={tab}
          options={tabOptions}
          mb={3}
          onChange={(nextTab) => {
            setTab(nextTab);
            setBanner(null);
          }}
        />

        {tab === DocsTab.NOTES ? <DocsNotesTab onBanner={setBanner} /> : null}
        {tab === DocsTab.CREDENTIALS ? <DocsCredentialsTab onBanner={setBanner} /> : null}
        {tab === DocsTab.CONTACTS ? <DocsContactsTab onBanner={setBanner} /> : null}
        {tab === DocsTab.SERVICES && isAdmin ? <DocsServicesTab onBanner={setBanner} /> : null}
      </Box>
    </DashboardShell>
  );
}
