import { Flex, Text } from '@chakra-ui/react';
import type { ReactElement } from 'react';

export const TOPBAR_HEIGHT = '16';
export const TOPBAR_BLOCK_SIZE = '4rem';

export function Topbar(): ReactElement {
  const dateLabel: string = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Flex
      as="header"
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="sticky"
      h={TOPBAR_HEIGHT}
      px={{ base: '4', md: '6' }}
      align="center"
      justify="space-between"
      bg="topbar.primary"
      color="text.tertiary"
    >
      <Text fontWeight="semibold">Hey comrade, the hub awaits.</Text>
      <Text fontSize="sm" opacity={0.9}>
        {dateLabel}
      </Text>
    </Flex>
  );
}
