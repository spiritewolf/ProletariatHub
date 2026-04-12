import { Box, IconButton } from '@chakra-ui/react';
import { ComradeIconType } from '@proletariat-hub/web/shared';
import type { ReactElement } from 'react';

import { RECRUIT_AVATAR_MAP } from './constants';

type RecruitAvatarPickerProps = {
  selectedIconType: ComradeIconType;
  onChange: (iconType: ComradeIconType) => void;
};

export function RecruitAvatarPicker({
  selectedIconType,
  onChange,
}: RecruitAvatarPickerProps): ReactElement {
  return (
    <Box role="radiogroup" aria-label="Comrade icon">
      <Box display="flex" flexWrap="wrap" gap={2}>
        {Object.entries(RECRUIT_AVATAR_MAP).map(([key, value]) => {
          const isSelected = key === selectedIconType;
          return (
            <IconButton
              key={key}
              type="button"
              size="sm"
              variant="outline"
              borderWidth={isSelected ? '2px' : '1px'}
              borderColor={isSelected ? 'accent.primary' : 'border.primary'}
              bg={isSelected ? 'bg.secondary' : 'transparent'}
              aria-label={value.label}
              aria-checked={isSelected}
              role="radio"
              onClick={() => {
                // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                onChange(key as ComradeIconType);
              }}
            >
              <Box color={value.color}>
                <value.Icon size={18} aria-hidden />
              </Box>
            </IconButton>
          );
        })}
      </Box>
    </Box>
  );
}
