import { Box, Checkbox, Flex } from '@chakra-ui/react';
import { HubListItemStatus } from '@proletariat-hub/types';
import { Check } from 'lucide-react';
import type { ReactElement } from 'react';

type HubListCheckboxProps = {
  status: HubListItemStatus;
  isSelected?: boolean;
  onToggle?: () => void;
};

export function HubListCheckbox(props: HubListCheckboxProps): ReactElement {
  if (props.status === HubListItemStatus.PURCHASED) {
    return (
      <Flex
        align="center"
        justify="center"
        boxSize="4.5"
        borderRadius="sm"
        flexShrink={0}
        bg="success.solid"
        color="text.light"
        aria-hidden
      >
        <Check size={12} strokeWidth={3} aria-hidden />
      </Flex>
    );
  }
  if (props.status === HubListItemStatus.CLAIMED) {
    return (
      <Flex
        align="center"
        justify="center"
        boxSize="4.5"
        borderRadius="sm"
        flexShrink={0}
        bg="info.solid"
        aria-hidden
      >
        <Box boxSize="2.5" borderRadius="sm" bg="text.light" />
      </Flex>
    );
  }
  return (
    <Flex align="center" justify="center" boxSize="4.5" flexShrink={0}>
      <Checkbox.Root
        size="sm"
        variant="outline"
        colorPalette="brandPalette"
        cursor="pointer"
        checked={props.isSelected ?? false}
        onCheckedChange={() => {
          props.onToggle?.();
        }}
        aria-label="Select hub list item"
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control cursor="pointer" boxSize="4.5">
          <Checkbox.Indicator />
        </Checkbox.Control>
      </Checkbox.Root>
    </Flex>
  );
}
