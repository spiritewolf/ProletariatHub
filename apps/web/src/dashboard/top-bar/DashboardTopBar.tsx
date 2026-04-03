import { Flex, Text } from '@chakra-ui/react';
import type { DashboardSummary } from '@proletariat-hub/contracts';
import { DashboardCopy } from '../utils/dashboardCopy';
import { dashboardTheme } from '../dashboardTheme';

type DashboardTopBarProps = {
  summary: DashboardSummary | null;
};

export function DashboardTopBar({ summary }: DashboardTopBarProps) {
  return (
    <Flex
      align="center"
      justify="space-between"
      gap={3}
      flexWrap="nowrap"
      px={4}
      py={2.5}
      bg={dashboardTheme.topBarBg}
      color={dashboardTheme.topBarFg}
      flexShrink={0}
      minH="48px"
    >
      <Flex align="center" gap={2} minW={0} flex="1">
        <Text
          fontSize="11px"
          fontWeight="medium"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {summary?.greeting ?? DashboardCopy.loading}
        </Text>
        {summary && summary.urgentOpenCount > 0 ? (
          <Text
            as="span"
            fontSize="9px"
            fontWeight="bold"
            bg="rgba(255,255,255,0.15)"
            px={2}
            py={0.5}
            borderRadius="full"
            flexShrink={0}
          >
            {summary.urgentOpenCount}
            {DashboardCopy.urgentBadgeSuffix}
          </Text>
        ) : null}
      </Flex>
      <Text
        fontSize="9px"
        textAlign="center"
        flex="1.5"
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
        display={{ base: 'none', md: 'block' }}
      >
        {summary?.statusLine ?? ''}
      </Text>
      <Text fontSize="9px" flex="1" textAlign="right" whiteSpace="nowrap" flexShrink={0}>
        {summary?.today ?? ''}
      </Text>
    </Flex>
  );
}
