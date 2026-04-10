import { Heading } from '@chakra-ui/react';
import type { ReactElement, ReactNode } from 'react';
export function SectionLabel(props: { children: ReactNode }): ReactElement {
  return (
    <Heading as="h2" size="lg" mb="3">
      {props.children}
    </Heading>
  );
}
