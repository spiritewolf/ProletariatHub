import { Text } from '@chakra-ui/react';

import { flowPalette } from '../../../styles/flow-theme';

type FlowStepLabelProps = {
  step: number;
};

export function FlowStepLabel({ step }: FlowStepLabelProps): React.ReactElement {
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
