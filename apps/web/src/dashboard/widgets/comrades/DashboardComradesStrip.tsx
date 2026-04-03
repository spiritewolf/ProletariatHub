import { Box, Flex, Text } from '@chakra-ui/react';
import type { DashboardComradeRow } from '@proletariat-hub/contracts';

import { dashboardTheme } from '../../dashboardTheme';
import { DashboardCopy } from '../../utils/dashboardCopy';

type DashboardComradesStripProps = {
  comrades: DashboardComradeRow[] | undefined;
};

export function DashboardComradesStrip({ comrades }: DashboardComradesStripProps) {
  return (
    <Box
      flexShrink={0}
      h="76px"
      borderWidth="1px"
      borderColor={dashboardTheme.cardBorder}
      borderRadius="md"
      bg={dashboardTheme.cardBg}
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      <Flex
        align="center"
        justify="space-between"
        px={2}
        py={1.5}
        borderBottomWidth="1px"
        borderColor={dashboardTheme.cardBorder}
        flexShrink={0}
      >
        <Text
          fontSize="11px"
          fontWeight="semibold"
          color={dashboardTheme.title}
          letterSpacing="0.02em"
        >
          {DashboardCopy.comradesSectionTitle}
        </Text>
        <Text fontSize="9px" color={dashboardTheme.title}>
          {DashboardCopy.comradesAddLabel}
        </Text>
      </Flex>
      <Flex flex={1} minH={0} align="center" px={2} gap={2} overflowX="auto" overflowY="hidden">
        {comrades?.map((comrade) => (
          <Flex
            key={comrade.id}
            align="center"
            gap={2}
            flexShrink={0}
            borderWidth="1px"
            borderColor={dashboardTheme.cardBorder}
            borderRadius="full"
            px={2}
            py={1}
          >
            <Flex
              w="22px"
              h="22px"
              borderRadius="full"
              bg={dashboardTheme.sidebarBg}
              color={dashboardTheme.sidebarFg}
              align="center"
              justify="center"
              fontSize="10px"
              fontWeight="bold"
            >
              {comrade.username.slice(0, 1).toUpperCase()}
            </Flex>
            <Box minW={0}>
              <Text
                fontSize="10px"
                fontWeight="semibold"
                color={dashboardTheme.text}
                whiteSpace="nowrap"
              >
                {comrade.username}
              </Text>
              <Text fontSize="8px" color={dashboardTheme.meta} whiteSpace="nowrap">
                {comrade.isAdmin ? DashboardCopy.adminRoleLabel : DashboardCopy.comradeRoleLabel}
              </Text>
            </Box>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}
