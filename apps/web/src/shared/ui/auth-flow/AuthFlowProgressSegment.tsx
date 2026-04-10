import { Box } from '@chakra-ui/react';
import type { ReactElement } from 'react';

export type AuthFlowProgressSegmentProps = {
  filled: boolean;
};

export function AuthFlowProgressSegment({ filled }: AuthFlowProgressSegmentProps): ReactElement {
  return (
    <Box flex={1} h="6px" borderRadius="full" bg={filled ? 'brand.primary' : 'brand.secondary'} />
  );
}
