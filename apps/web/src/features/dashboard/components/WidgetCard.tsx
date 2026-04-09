import { Card } from '@chakra-ui/react';
import type { ReactElement } from 'react';

export function WidgetCard(): ReactElement {
  return <Card.Root variant="outline" size="md" h="full" minH="0" minW="0" />;
}
