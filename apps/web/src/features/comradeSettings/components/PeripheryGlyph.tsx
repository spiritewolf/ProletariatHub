import { Box } from '@chakra-ui/react';
import type { HubPeripheryCategory, Periphery } from '@proletariat-hub/types';
import {
  ComradeAvatarIconType,
  HubPeripheryCategory as HubPeripheryCategoryConst,
} from '@proletariat-hub/types';
import { RECRUIT_AVATAR_MAP } from '@proletariat-hub/web/features/setupWizard/steps/components/constants';
import { User } from 'lucide-react';
import type { ReactElement } from 'react';

type PeripheryGlyphProps = {
  category: HubPeripheryCategory;
  avatarIcon: Periphery['settings']['avatarIcon'];
};

function isRecruitMapKey(key: string): key is keyof typeof RECRUIT_AVATAR_MAP {
  return key in RECRUIT_AVATAR_MAP;
}

export function PeripheryGlyph({ category, avatarIcon }: PeripheryGlyphProps): ReactElement {
  if (category === HubPeripheryCategoryConst.PERSON) {
    return (
      <Box
        flexShrink={0}
        color="text.tertiary"
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
      >
        <User size={20} aria-hidden />
      </Box>
    );
  }

  const avatarIconOrDefaultSnail = avatarIcon ?? ComradeAvatarIconType.SNAIL;
  const recruitMapKey = isRecruitMapKey(avatarIconOrDefaultSnail)
    ? avatarIconOrDefaultSnail
    : ComradeAvatarIconType.SNAIL;
  const recruitGlyphItem = RECRUIT_AVATAR_MAP[recruitMapKey];
  const GlyphIcon = recruitGlyphItem.Icon;
  const glyphColorToken = recruitGlyphItem.color;

  return (
    <Box
      flexShrink={0}
      color={glyphColorToken}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
    >
      <GlyphIcon size={20} aria-hidden />
    </Box>
  );
}
