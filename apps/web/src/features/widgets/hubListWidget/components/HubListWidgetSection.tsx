import { Separator, Stack, Text } from '@chakra-ui/react';
import type { ReactElement, ReactNode } from 'react';

type HubListWidgetSectionProps = {
  dividerLabel: string;
  children: ReactNode;
  shouldDisplaySeparator: boolean;
};

export function HubListWidgetSection({
  dividerLabel,
  children,
  shouldDisplaySeparator,
}: HubListWidgetSectionProps): ReactElement {
  return (
    <Stack gap="3" pt="4" w="full">
      {shouldDisplaySeparator ? <Separator borderColor="hubList.border" /> : null}
      <Text
        fontSize="xs"
        fontWeight="semibold"
        letterSpacing="0.12em"
        color="accent.primary"
        textTransform="uppercase"
      >
        {dividerLabel}
      </Text>
      <Stack gap="0" w="full">
        {children}
      </Stack>
    </Stack>
  );
}
