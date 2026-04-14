import {
  ComradeAvatarIconType,
  HubPeripheryCategory,
  type HubPeripherySettingsConfig,
  type Periphery,
} from '@proletariat-hub/types';

import { validateConstEnumType } from '../../shared/util/helpers';
import type { PeripheryDbRecord, PeripherySettingsDbRecord } from './types';

function parsePeripherySettings(settings: PeripherySettingsDbRecord): HubPeripherySettingsConfig {
  return {
    id: settings.id,
    createdAt: settings.createdAt,
    updatedAt: settings.updatedAt,
    birthDate: settings.birthDate,
    avatarIcon:
      settings.avatarIcon == null
        ? null
        : validateConstEnumType(ComradeAvatarIconType, settings.avatarIcon, 'avatar icon'),
    avatarColor: settings.avatarColor,
    phoneNumber: settings.phoneNumber,
    email: settings.email,
  };
}

export function parsePeriphery(record: PeripheryDbRecord): Periphery {
  return {
    id: record.id,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    name: record.name,
    peripheryCategory: validateConstEnumType(
      HubPeripheryCategory,
      record.peripheryCategory,
      'periphery category',
    ),
    notes: record.notes,
    hubId: record.hubId,
    createdById: record.createdById,
    settings: parsePeripherySettings(record.settings),
  };
}
