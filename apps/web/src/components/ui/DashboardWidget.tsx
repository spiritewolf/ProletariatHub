import { Box, Flex, type FlexProps, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import { dashboardTheme } from '../../styles/dashboardTheme';

interface DashboardWidgetProps extends FlexProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

export function DashboardWidget({
  title,
  action,
  children,
  ...flexProps
}: DashboardWidgetProps): React.ReactElement {
  return (
    <Flex
      direction="column"
      minH={0}
      minW={0}
      borderWidth="1px"
      borderColor={dashboardTheme.cardBorder}
      borderRadius="md"
      bg={dashboardTheme.cardBg}
      overflow="hidden"
      {...flexProps}
    >
      <Flex
        align="center"
        justify="space-between"
        gap={2}
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
          textTransform="uppercase"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {title}
        </Text>
        {action ? (
          <Box flexShrink={0} fontSize="10px" color={dashboardTheme.title}>
            {action}
          </Box>
        ) : null}
      </Flex>
      <Box flex={1} minH={0} overflowY="auto" px={2} py={1.5}>
        {children}
      </Box>
    </Flex>
  );
}
