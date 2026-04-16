import { Button, HStack } from '@chakra-ui/react';
import { HubListItemPriority } from '@proletariat-hub/types';
import type { ReactElement } from 'react';

import { HUB_LIST_PRIORITY_LABEL } from '../types';

const HUB_LIST_PRIORITY_UI_ORDER: HubListItemPriority[] = [
  HubListItemPriority.LOW,
  HubListItemPriority.MEDIUM,
  HubListItemPriority.HIGH,
  HubListItemPriority.URGENT,
];

export type PriorityPillSelectProps = {
  value: HubListItemPriority;
  onChange: (value: HubListItemPriority) => void;
};

export function PriorityPillSelect({ value, onChange }: PriorityPillSelectProps): ReactElement {
  return (
    <HStack gap="2" flexWrap="wrap">
      {HUB_LIST_PRIORITY_UI_ORDER.map((priority) => {
        const isSelected = value === priority;
        return (
          <Button
            key={priority}
            type="button"
            size="sm"
            borderRadius="full"
            variant={isSelected ? 'solid' : 'outline'}
            bg={isSelected ? 'accent.primary' : undefined}
            color={isSelected ? 'text.light' : 'text.primary'}
            borderColor="border.primary"
            onClick={() => {
              onChange(priority);
            }}
          >
            {HUB_LIST_PRIORITY_LABEL[priority]}
          </Button>
        );
      })}
    </HStack>
  );
}
