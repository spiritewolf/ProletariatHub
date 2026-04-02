import { Box, Flex, Heading, HStack, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { flowPalette } from '../../flow-theme';

type Props = {
  /** Shown under the logo (e.g. hub name or “the household collective”). */
  subtitle: string;
  /** 0 = hide progress bar; 1–4 = filled segments. */
  progressFill?: number;
  children: ReactNode;
};

export function AuthenticationWizard({ subtitle, progressFill = 0, children }: Props) {
  return (
    <Box
      minH="100vh"
      bg={flowPalette.pageBg}
      color={flowPalette.text}
      py={{ base: 8, md: 12 }}
      px={4}
    >
      <Box maxW="28rem" mx="auto">
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
        <Box as="main">{children}</Box>
      </Box>
    </Box>
  );
}

export function FlowCard({ children }: { children: ReactNode }) {
  return (
    <Box
      bg={flowPalette.cardBg}
      borderRadius="xl"
      borderWidth="1px"
      borderColor={flowPalette.border}
      boxShadow="0 12px 40px rgba(128, 21, 48, 0.08)"
      p={{ base: 6, md: 8 }}
    >
      {children}
    </Box>
  );
}

export function FlowStepLabel({ step }: { step: number }) {
  return (
    <Text
      fontSize="xs"
      fontWeight="semibold"
      letterSpacing="0.12em"
      color={flowPalette.maroon}
      mb={4}
    >
      ★ STEP {step} OF 4
    </Text>
  );
}
