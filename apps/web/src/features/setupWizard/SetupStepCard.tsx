import { Heading, Stack, Text } from '@chakra-ui/react';
import type { ReactElement, ReactNode } from 'react';

type SetupStepCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function SetupStepCard({ title, description, children }: SetupStepCardProps): ReactElement {
  return (
    <Stack gap={0} align="stretch">
      <Heading as="h2" size="xl" mb={3} color="text.primary">
        {title}
      </Heading>
      {description ? (
        <Text color="text.secondary" mb={3} fontSize="sm" lineHeight="tall">
          {description}
        </Text>
      ) : null}
      {children}
    </Stack>
  );
}
