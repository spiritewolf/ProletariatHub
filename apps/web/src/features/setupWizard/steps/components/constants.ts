import { ComradeAvatarIconType } from '@proletariat-hub/types';
import type { LucideIcon } from 'lucide-react';
import {
  Atom,
  Cat,
  Crown,
  Dog,
  EggFried,
  Fish,
  HandFist,
  Menu,
  Palette,
  Snail,
  User,
} from 'lucide-react';

export type RecruitAvatarPickerItem = {
  label: string;
  Icon: LucideIcon;
  color: string;
};

export const RECRUIT_AVATAR_MAP: Record<ComradeAvatarIconType, RecruitAvatarPickerItem> = {
  [ComradeAvatarIconType.USER]: { label: 'Default icon', Icon: User, color: 'text.secondary' },
  [ComradeAvatarIconType.MENU]: { label: 'Menu', Icon: Menu, color: 'accent.primary' },
  [ComradeAvatarIconType.HAND_FIST]: { label: 'Fist', Icon: HandFist, color: 'brand.secondary' },
  [ComradeAvatarIconType.CROWN]: { label: 'Crown', Icon: Crown, color: 'accent.secondary' },
  [ComradeAvatarIconType.ATOM]: { label: 'Atom', Icon: Atom, color: 'status.info' },
  [ComradeAvatarIconType.EGG_FRIED]: {
    label: 'Egg fried',
    Icon: EggFried,
    color: 'status.warning',
  },
  [ComradeAvatarIconType.PALETTE]: { label: 'Palette', Icon: Palette, color: 'accent.hover' },
  [ComradeAvatarIconType.SNAIL]: { label: 'Snail', Icon: Snail, color: 'status.neutral' },
  [ComradeAvatarIconType.CAT]: { label: 'Cat', Icon: Cat, color: 'accent.primary' },
  [ComradeAvatarIconType.DOG]: { label: 'Dog', Icon: Dog, color: 'accent.hover' },
  [ComradeAvatarIconType.FISH]: { label: 'Fish', Icon: Fish, color: 'status.info' },
};
