import { ComradeAvatarIconType, HubPeripheryCategory } from '@proletariat-hub/types';

import type { HubPeripheryDrawerFormValues } from './types';

export const PERIPHERY_PET_GLYPH_ICONS = [
  ComradeAvatarIconType.CAT,
  ComradeAvatarIconType.DOG,
  ComradeAvatarIconType.FISH,
  ComradeAvatarIconType.SNAIL,
] as const;

export const PERIPHERY_FORM_DEFAULTS: HubPeripheryDrawerFormValues = {
  name: '',
  peripheryCategory: HubPeripheryCategory.PERSON,
  birthDate: '',
  petAvatarIcon: ComradeAvatarIconType.SNAIL,
};
