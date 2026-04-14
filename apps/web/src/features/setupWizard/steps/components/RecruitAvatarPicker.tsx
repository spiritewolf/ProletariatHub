import { Box, IconButton } from '@chakra-ui/react';
import type { ComradeAvatarIconType } from '@proletariat-hub/types';
import type { ReactElement } from 'react';

import { RECRUIT_AVATAR_MAP, type RecruitAvatarPickerItem } from './constants';

type RecruitAvatarPickerProps = {
  selectedIconType: ComradeAvatarIconType;
  onChange: (iconType: ComradeAvatarIconType) => void;
};

function isComradeAvatarIconMapKey(
  key: string,
  map: Record<ComradeAvatarIconType, RecruitAvatarPickerItem>,
): key is ComradeAvatarIconType {
  return Object.hasOwn(map, key);
}

export function RecruitAvatarPicker({
  selectedIconType,
  onChange,
}: RecruitAvatarPickerProps): ReactElement {
  const orderedKeys = Object.keys(RECRUIT_AVATAR_MAP).filter((key) =>
    isComradeAvatarIconMapKey(key, RECRUIT_AVATAR_MAP),
  );

  return (
    <Box role="radiogroup" aria-label="Comrade icon">
      <Box display="flex" flexWrap="wrap" gap={2}>
        {orderedKeys.map((iconType) => {
          const value = RECRUIT_AVATAR_MAP[iconType];
          const isSelected = iconType === selectedIconType;
          return (
            <IconButton
              key={iconType}
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
                onChange(iconType);
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
