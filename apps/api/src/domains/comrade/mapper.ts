import { type Comrade, ComradeOnboardStatus, ComradeRole } from '@proletariat-hub/shared';

import { validateConstEnumType } from '../../shared/lib/helpers';
import type { ComradeDbRecord } from './types';

export function parseComrade(comradeDbRecord: ComradeDbRecord): Comrade {
  return {
    id: comradeDbRecord.id,
    createdAt: comradeDbRecord.createdAt,
    updatedAt: comradeDbRecord.updatedAt,
    username: comradeDbRecord.username,
    role: validateConstEnumType(ComradeRole, comradeDbRecord.role.roleType, 'role'),
    onboardStatus: validateConstEnumType(
      ComradeOnboardStatus,
      comradeDbRecord.onboardStatus,
      'onboard status',
    ),
    phoneNumber: comradeDbRecord.settings.phoneNumber ?? undefined,
    email: comradeDbRecord.settings.email ?? undefined,
    signalUsername: comradeDbRecord.settings.signalUsername ?? undefined,
    telegramUsername: comradeDbRecord.settings.telegramUsername ?? undefined,
  };
}
