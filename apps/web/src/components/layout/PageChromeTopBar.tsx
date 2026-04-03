import { Flex, Text } from '@chakra-ui/react';
import { useMemo } from 'react';

import { dashboardTheme } from '../../styles/dashboardTheme';

type PageChromeTopBarProps = {
  title: string;
};

/** Maroon bar matching the dashboard header, for non-dashboard routes (e.g. Shopping). */
export function PageChromeTopBar({ title }: PageChromeTopBarProps): React.ReactElement {
  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    [],
  );

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
      <Text
        fontSize="11px"
        fontWeight="semibold"
        letterSpacing="0.02em"
        textTransform="uppercase"
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
      >
        ★ {title}
      </Text>
      <Text fontSize="9px" whiteSpace="nowrap" flexShrink={0}>
        {todayLabel}
      </Text>
    </Flex>
  );
}
