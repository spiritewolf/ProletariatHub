import { Text } from '@chakra-ui/react';
import { Star } from 'lucide-react';
import type { ReactElement } from 'react';

import { AUTH_FLOW_TOTAL_STEPS } from './constants';

type AuthFlowStepLabelProps = {
  step: number;
};

export function AuthFlowStepLabel({ step }: AuthFlowStepLabelProps): ReactElement {
  return (
    <Text fontSize="xs" fontWeight="semibold" letterSpacing="0.12em" color="text.secondary" mb={4}>
      <Text as="span" display="inline-flex" alignItems="center" gap={1}>
        <Star size={12} aria-hidden />
        <Text as="span">
          Step {step} of {AUTH_FLOW_TOTAL_STEPS}
        </Text>
      </Text>
    </Text>
  );
}
