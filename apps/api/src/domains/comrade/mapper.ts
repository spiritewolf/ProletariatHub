import {
  type Comrade,
  ComradeAvatarIconType,
  ComradeOnboardStatus,
  ComradeRole,
} from '@proletariat-hub/shared';

import { validateConstEnumType } from '../../shared/lib/helpers';
import type { ComradeDbRecord } from './types';

export function parseComrade(comradeDbRecord: ComradeDbRecord): Comrade {
  const avatarIconRaw = comradeDbRecord.settings.avatarIcon;
  const avatarIcon = !avatarIconRaw
    ? null
    : validateConstEnumType(ComradeAvatarIconType, avatarIconRaw, 'avatar icon');

  return {
    id: comradeDbRecord.id,
    createdAt: comradeDbRecord.createdAt,
    updatedAt: comradeDbRecord.updatedAt,
    username: comradeDbRecord.username,
    hubId: comradeDbRecord.hubId,
    role: validateConstEnumType(ComradeRole, comradeDbRecord.role.roleType, 'role'),
    onboardStatus: validateConstEnumType(
      ComradeOnboardStatus,
      comradeDbRecord.onboardStatus,
      'onboard status',
    ),
    settings: {
      id: comradeDbRecord.settings.id,
      createdAt: comradeDbRecord.settings.createdAt,
      updatedAt: comradeDbRecord.settings.updatedAt,
      avatarIcon,
      avatarColor: comradeDbRecord.settings.avatarColor,
      phoneNumber: comradeDbRecord.settings.phoneNumber,
      email: comradeDbRecord.settings.email,
      signalUsername: comradeDbRecord.settings.signalUsername,
      telegramUsername: comradeDbRecord.settings.telegramUsername,
    },
    phoneNumber: comradeDbRecord.settings.phoneNumber ?? undefined,
    email: comradeDbRecord.settings.email ?? undefined,
    signalUsername: comradeDbRecord.settings.signalUsername ?? undefined,
    telegramUsername: comradeDbRecord.settings.telegramUsername ?? undefined,
  };
}
