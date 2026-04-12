import { ComradeIconType } from '@proletariat-hub/web/shared';
import type { LucideIcon } from 'lucide-react';
import { Atom, Crown, EggFried, HandFist, Menu, Palette, Snail, User } from 'lucide-react';

export type RecruitAvatarPickerItem = {
  label: string;
  Icon: LucideIcon;
  color: string;
};

export const RECRUIT_AVATAR_MAP: Record<ComradeIconType, RecruitAvatarPickerItem> = {
  [ComradeIconType.USER]: { label: 'Default icon', Icon: User, color: 'text.secondary' },
  [ComradeIconType.MENU]: { label: 'Menu', Icon: Menu, color: 'accent.primary' },
  [ComradeIconType.HAND_FIST]: { label: 'Fist', Icon: HandFist, color: 'brand.secondary' },
  [ComradeIconType.CROWN]: { label: 'Crown', Icon: Crown, color: 'accent.secondary' },
  [ComradeIconType.ATOM]: { label: 'Atom', Icon: Atom, color: 'status.info' },
  [ComradeIconType.EGG_FRIED]: { label: 'Egg fried', Icon: EggFried, color: 'status.warning' },
  [ComradeIconType.PALETTE]: { label: 'Palette', Icon: Palette, color: 'accent.hover' },
  [ComradeIconType.SNAIL]: { label: 'Snail', Icon: Snail, color: 'status.neutral' },
} as const;
