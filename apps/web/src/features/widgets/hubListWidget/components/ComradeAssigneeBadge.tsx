import { Flex, HStack, Text } from '@chakra-ui/react';
import type { ReactElement } from 'react';

type ComradeAssigneeBadgeProps = {
  displayInitial: string;
  username: string;
};

export function ComradeAssigneeBadge({
  displayInitial,
  username,
}: ComradeAssigneeBadgeProps): ReactElement {
  return (
    <HStack gap="2">
      <Flex
        w="4.5"
        h="4.5"
        borderRadius="full"
        bg="accent.secondary"
        color="text.light"
        align="center"
        justify="center"
        fontSize="2xs"
        fontWeight="medium"
        flexShrink={0}
        aria-hidden
      >
        {displayInitial}
      </Flex>
      <Text fontSize="xs" color="text.secondary" maxW="24" lineClamp={1}>
        {username}
      </Text>
    </HStack>
  );
}
