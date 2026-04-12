import { Box, Flex, Heading, HStack, Text } from '@chakra-ui/react';
import { SetupSteps } from '@proletariat-hub/web/shared';
import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

import { useSetupWizard } from './hooks/useSetupWizard';
import { AccountStep } from './steps/AccountStep';
import { ComradesStep } from './steps/ComradesStep';
import { HubStep } from './steps/HubStep';
import { LaunchStep } from './steps/LaunchStep';

const SetupStepComponentMap: Record<SetupSteps, React.ReactElement> = {
  [SetupSteps.ACCOUNT]: <AccountStep />,
  [SetupSteps.HUB]: <HubStep />,
  [SetupSteps.COMRADES]: <ComradesStep />,
  [SetupSteps.LAUNCH]: <LaunchStep />,
};

export function SetupWizardContent(): ReactElement {
  const { stepper, setupSteps, submitMutation, stepIndex } = useSetupWizard();

  if (submitMutation.isSuccess) {
    return <Navigate to="/" replace />;
  }

  const progressFill = stepper.value + 1;
  const progressTotal = setupSteps.length;
  const activeStepKey = setupSteps[stepIndex];
  const stepNumbers = Array.from({ length: progressTotal }, (_, index) => index + 1);

  return (
    <Box minH="100vh" bg="bg.light" py={{ base: 8, md: 12 }} px={4}>
      <Box maxW="28rem" mx="auto" w="100%">
        <Box
          borderRadius="xl"
          borderWidth="1px"
          borderColor="border.primary"
          overflow="hidden"
          shadow="card"
        >
          <Flex
            direction="column"
            bg="topbar.primary"
            color="text.light"
            px={{ base: 6, md: 8 }}
            pt={6}
            pb={5}
          >
            <Heading as="h1" size="lg" letterSpacing="-0.02em">
              ProletariatHub
            </Heading>
            <Text mt={2} fontSize="sm" opacity={0.92}>
              the household collective
            </Text>
            <HStack
              gap={2}
              role="progressbar"
              mt={6}
              aria-valuenow={progressFill}
              aria-valuemin={1}
              aria-valuemax={progressTotal}
              aria-label={`Step ${progressFill} of ${progressTotal}`}
            >
              {stepNumbers.map((stepNumber) => (
                <Box
                  key={stepNumber}
                  flex={1}
                  h="1.5"
                  borderRadius="full"
                  bg={stepNumber <= progressFill ? 'bg.primary' : 'border.secondary'}
                />
              ))}
            </HStack>
          </Flex>
          <Box bg="bg.primary" px={{ base: 6, md: 8 }} py={{ base: 6, md: 8 }}>
            <Text
              fontSize="xs"
              fontWeight="semibold"
              letterSpacing="0.12em"
              color="accent.primary"
              textTransform="uppercase"
              mb={4}
            >
              Step {progressFill} of {progressTotal}
            </Text>
            {activeStepKey !== undefined ? SetupStepComponentMap[activeStepKey] : null}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
