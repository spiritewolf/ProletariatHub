import { Box, Flex, Heading, HStack, Text } from '@chakra-ui/react';

import { flowPalette } from '../../../styles/flow-theme';

type WizardHeaderProps = {
  subtitle: string;
  progressFill: number;
};

export function WizardHeader({ subtitle, progressFill }: WizardHeaderProps): React.ReactElement {
  return (
    <Box as="header" mb={8}>
      <Flex justify="space-between" align="flex-start" gap={4} mb={progressFill > 0 ? 6 : 0}>
        <Box>
          <Heading as="h1" size="lg" letterSpacing="-0.02em" color={flowPalette.maroon}>
            ★ ProletariatHub
          </Heading>
          <Text mt={2} fontSize="sm" color={flowPalette.muted}>
            {subtitle}
          </Text>
        </Box>
        <Text fontSize="xl" color={flowPalette.maroonSoft} aria-hidden userSelect="none">
          ★★
        </Text>
      </Flex>
      {progressFill > 0 ? (
        <HStack
          gap={2}
          role="progressbar"
          aria-valuenow={progressFill}
          aria-valuemin={1}
          aria-valuemax={4}
          aria-label={`Step ${progressFill} of 4`}
        >
          {[1, 2, 3, 4].map((stepIndex) => {
            const filled = stepIndex <= progressFill;
            return (
              <Box
                key={stepIndex}
                flex={1}
                h="6px"
                borderRadius="full"
                bg={filled ? flowPalette.progressFill : flowPalette.progressEmpty}
              />
            );
          })}
        </HStack>
      ) : null}
    </Box>
  );
}
