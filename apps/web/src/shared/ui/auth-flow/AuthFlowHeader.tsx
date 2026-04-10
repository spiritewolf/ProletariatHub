import { Box, Flex, Heading, HStack, Text } from '@chakra-ui/react';
import type { ReactElement } from 'react';

import { AuthFlowProgressSegment } from './AuthFlowProgressSegment';
import { AUTH_FLOW_STEP_NUMBERS, AUTH_FLOW_TOTAL_STEPS } from './constants';

type AuthFlowHeaderProps = {
  subtitle: string;
  progressFill: number;
};

export function AuthFlowHeader({ subtitle, progressFill }: AuthFlowHeaderProps): ReactElement {
  const showProgress = progressFill > 0;

  return (
    <Box as="header" mb={8}>
      <Flex justify="space-between" align="flex-start" gap={4} mb={showProgress ? 6 : 0}>
        <Box>
          <Heading as="h1" size="lg" letterSpacing="-0.02em" color="header.primary">
            ProletariatHub
          </Heading>
          <Text mt={2} fontSize="sm" color="text.secondary">
            {subtitle}
          </Text>
        </Box>
      </Flex>
      {showProgress ? (
        <HStack
          gap={2}
          role="progressbar"
          aria-valuenow={progressFill}
          aria-valuemin={1}
          aria-valuemax={AUTH_FLOW_TOTAL_STEPS}
          aria-label={`Step ${progressFill} of ${AUTH_FLOW_TOTAL_STEPS}`}
        >
          {AUTH_FLOW_STEP_NUMBERS.map((stepNumber) => (
            <AuthFlowProgressSegment key={stepNumber} filled={stepNumber <= progressFill} />
          ))}
        </HStack>
      ) : null}
    </Box>
  );
}
