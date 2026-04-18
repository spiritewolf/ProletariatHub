import { Box, Flex } from '@chakra-ui/react';
import { HubListItemStatus } from '@proletariat-hub/types';
import { Check } from 'lucide-react';
import type { ReactElement } from 'react';

type HubListCheckboxProps = {
  displayStatus: HubListItemStatus;
};

export function HubListCheckbox({ displayStatus }: HubListCheckboxProps): ReactElement {
  if (displayStatus === HubListItemStatus.PURCHASED) {
    return (
      <Flex
        align="center"
        justify="center"
        boxSize="4.5"
        borderRadius="sm"
        flexShrink={0}
        bg="success.fg"
        color="text.light"
        aria-hidden
      >
        <Check size={12} strokeWidth={3} aria-hidden />
      </Flex>
    );
  }
  if (displayStatus === HubListItemStatus.CLAIMED) {
    return (
      <Flex
        align="center"
        justify="center"
        boxSize="4.5"
        borderRadius="sm"
        flexShrink={0}
        bg="info.fg"
        aria-hidden
      >
        <Box boxSize="2.5" borderRadius="sm" bg="text.light" />
      </Flex>
    );
  }
  return (
    <Flex
      align="center"
      justify="center"
      boxSize="4.5"
      borderRadius="sm"
      borderWidth="1px"
      borderColor="border.primary"
      flexShrink={0}
      bg="transparent"
      aria-hidden
    />
  );
}
