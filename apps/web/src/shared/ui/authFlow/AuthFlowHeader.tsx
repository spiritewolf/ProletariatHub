import { Box, Flex, Heading, HStack, Text } from '@chakra-ui/react';
import type { ReactElement } from 'react';

import { AUTH_FLOW_TOTAL_STEPS } from './constants';

type AuthFlowHeaderProps = {
  subtitle: string;
  progressFill: number;
  progressTotal?: number;
};

export function AuthFlowHeader({
  subtitle,
  progressFill,
  progressTotal,
}: AuthFlowHeaderProps): ReactElement {
  const showProgress = progressFill > 0;
  const total = progressTotal ?? AUTH_FLOW_TOTAL_STEPS;
  const stepNumbers: readonly number[] = Array.from({ length: total }, (_, index) => index + 1);

  return (
    <Box as="header" mb={8}>
      <Flex justify="space-between" align="flex-start" gap={4} mb={showProgress ? 6 : 0}>
        <Box>
          <Heading as="h1" size="lg" letterSpacing="-0.02em" color="header.primary">
            ProletariatHub
          </Heading>
          <Text mt={2} textStyle="helperText">
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
          aria-valuemax={total}
          aria-label={`Step ${progressFill} of ${total}`}
        >
          {stepNumbers.map((stepNumber) => (
            <Box
              key={stepNumber}
              flex={1}
              h="6px"
              borderRadius="full"
              bg={stepNumber <= progressFill ? 'brand.primary' : 'brand.secondary'}
            />
          ))}
        </HStack>
      ) : null}
    </Box>
  );
}
