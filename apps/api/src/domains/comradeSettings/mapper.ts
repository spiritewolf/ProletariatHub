import { ComradeAvatarIconType, type ComradeSettingsConfig } from '@proletariat-hub/types';

import { validateConstEnumType } from '../../shared/util/helpers';
import type { ComradeSettingsConfigDbRecord } from './types';

export function parseComradeSettingsConfig(
  record: ComradeSettingsConfigDbRecord,
): ComradeSettingsConfig {
  const avatarIconRaw = record.avatarIcon;
  const avatarIcon = !avatarIconRaw
    ? null
    : validateConstEnumType(ComradeAvatarIconType, avatarIconRaw, 'avatar icon');

  return {
    id: record.id,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    birthDate: record.birthDate,
    avatarIcon,
    avatarColor: record.avatarColor,
    phoneNumber: record.phoneNumber,
    email: record.email,
    signalUsername: record.signalUsername,
    telegramUsername: record.telegramUsername,
  };
}
