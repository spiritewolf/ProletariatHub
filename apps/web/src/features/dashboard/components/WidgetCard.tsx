import { Card, Text } from '@chakra-ui/react';
import type { ReactElement } from 'react';

export function WidgetCard(): ReactElement {
  return (
    <Card.Root variant="outline" bg="Background.light" size="md" h="full" minH="0" minW="0">
      <Text>Widget Card</Text>
    </Card.Root>
  );
}
