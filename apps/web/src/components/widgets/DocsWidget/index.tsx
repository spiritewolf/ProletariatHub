import { Box, Flex, Text } from '@chakra-ui/react';

import { DashboardCopy } from '../../../features/dashboard/dashboardCopy';
import { AppPath } from '../../../lib/appPaths';
import { dashboardTheme } from '../../../styles/dashboardTheme';
import { DashboardInlineRouterLink } from '../../ui/DashboardInlineRouterLink';
import { MutedCaption } from '../../ui/MutedCaption';
import type { DocsWidgetProps } from './DocsWidget.types';

export function DocsWidget({ docsPreview }: DocsWidgetProps): React.ReactElement {
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
          {recentNotes.map((note) => (
            <Text
              key={note.id}
              fontSize="9px"
              color={dashboardTheme.text}
              lineHeight="1.35"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              ◇ {note.title}
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
