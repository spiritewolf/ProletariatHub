import { Box, Flex, Text } from '@chakra-ui/react';
import type { DashboardDocsPreview } from '@proletariat-hub/contracts';

import { AppPath } from '../../../appPaths';
import { MutedCaption } from '../../../components/shared/MutedCaption';
import { DashboardInlineRouterLink } from '../../components/DashboardInlineRouterLink';
import { dashboardTheme } from '../../dashboardTheme';
import { DashboardCopy } from '../../utils/dashboardCopy';

type DashboardDocsWidgetProps = {
  docsPreview: DashboardDocsPreview | undefined;
};

export function DashboardDocsWidget({ docsPreview }: DashboardDocsWidgetProps) {
  if (docsPreview === undefined) {
    return <MutedCaption text={DashboardCopy.loading} mutedColor={dashboardTheme.meta} />;
  }

  const { referenceNoteCount, credentialCount, contactCount, recentNotes } = docsPreview;
  const summaryLine = `${referenceNoteCount} note${referenceNoteCount === 1 ? '' : 's'} · ${credentialCount} password${credentialCount === 1 ? '' : 's'} · ${contactCount} contact${contactCount === 1 ? '' : 's'}`;

  return (
    <Flex direction="column" gap={2} minH={0}>
      <Text fontSize="9px" color={dashboardTheme.meta} lineHeight="1.3">
        {summaryLine}
      </Text>
      {recentNotes.length === 0 ? (
        <MutedCaption text={DashboardCopy.docsRecentEmpty} mutedColor={dashboardTheme.meta} />
      ) : (
        <Box minH={0} overflow="hidden">
          {recentNotes.map((n) => (
            <Text
              key={n.id}
              fontSize="9px"
              color={dashboardTheme.text}
              lineHeight="1.35"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              ◇ {n.title}
            </Text>
          ))}
        </Box>
      )}
      <Box mt="auto" pt={1}>
        <DashboardInlineRouterLink to={AppPath.Docs} fontSize="10px">
          {DashboardCopy.docsViewAll}
        </DashboardInlineRouterLink>
      </Box>
    </Flex>
  );
}
