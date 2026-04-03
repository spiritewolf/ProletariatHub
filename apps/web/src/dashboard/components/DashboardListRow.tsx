import { Box, Flex, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { dashboardTheme } from '../dashboardTheme';

type DashboardListRowProps = {
  leading?: ReactNode;
  title: string;
  meta: string;
  trailing?: ReactNode;
};

export function DashboardListRow({ leading, title, meta, trailing }: DashboardListRowProps) {
  return (
    <Flex align="center" gap={2} minH={dashboardTheme.rowHeight} py={0.5} role="group">
      <Box
        flexShrink={0}
        w="16px"
        h="16px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {leading}
      </Box>
      <Box flex={1} minW={0} overflow="hidden">
        <Text
          fontSize="10px"
          fontWeight="semibold"
          color={dashboardTheme.text}
          lineHeight="1.2"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {title}
        </Text>
        <Text
          fontSize="8px"
          color={dashboardTheme.meta}
          lineHeight="1.2"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {meta}
        </Text>
      </Box>
      {trailing ? (
        <Flex flexShrink={0} align="center" gap={1} maxW="45%">
          {trailing}
        </Flex>
      ) : null}
    </Flex>
  );
}
