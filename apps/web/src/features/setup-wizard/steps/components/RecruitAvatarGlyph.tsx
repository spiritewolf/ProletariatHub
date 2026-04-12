import { Box } from '@chakra-ui/react';
import { ComradeIconType } from '@proletariat-hub/web/shared';
import type { ReactElement } from 'react';

import { RECRUIT_AVATAR_MAP } from './constants';

type RecruitAvatarGlyphProps = {
  iconType: ComradeIconType;
  size?: number;
};

export function RecruitAvatarGlyph({ iconType, size = 20 }: RecruitAvatarGlyphProps): ReactElement {
  const { Icon, color } =
    RECRUIT_AVATAR_MAP?.[iconType] ?? RECRUIT_AVATAR_MAP[ComradeIconType.USER];
  return (
    <Box as="span" display="inline-flex" alignItems="center" justifyContent="center" color={color}>
      <Icon size={size} aria-hidden />
    </Box>
  );
}
