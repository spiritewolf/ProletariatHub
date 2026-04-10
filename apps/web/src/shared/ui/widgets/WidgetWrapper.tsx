import { Card, Stack } from '@chakra-ui/react';
import type { ReactElement, ReactNode } from 'react';

export function WidgetWrapper({ children }: { children: ReactNode }): ReactElement {
  return (
    <Card.Root variant="outline" w="full" h="full">
      <Stack p={4}>{children}</Stack>
    </Card.Root>
  );
}
