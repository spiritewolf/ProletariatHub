import { Box } from '@chakra-ui/react';
import { ComradeAvatarIconType } from '@proletariat-hub/web/shared';
import type { ReactElement } from 'react';

import { RECRUIT_AVATAR_MAP } from './constants';

type RecruitAvatarGlyphProps = {
  iconType: ComradeAvatarIconType;
  size: number;
};

export function RecruitAvatarGlyph({ iconType, size }: RecruitAvatarGlyphProps): ReactElement {
  const Icon =
    RECRUIT_AVATAR_MAP[iconType]?.Icon ?? RECRUIT_AVATAR_MAP[ComradeAvatarIconType.USER].Icon;
  const color = RECRUIT_AVATAR_MAP[iconType]?.color ?? 'text.secondary';

  return (
    <Box color={color} display="inline-flex" alignItems="center" justifyContent="center">
      <Icon size={size} aria-hidden />
    </Box>
  );
}
