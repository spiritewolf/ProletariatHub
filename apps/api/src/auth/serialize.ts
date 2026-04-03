import { type AuthenticatedComrade, authenticatedComradeSchema } from '@proletariat-hub/contracts';

import type { ComradeRow } from './session.js';

export function serializeAuthenticatedComrade(
  comrade: ComradeRow,
  hubName: string,
): AuthenticatedComrade {
  const candidate = {
    id: comrade.id,
    username: comrade.username,
    hubId: comrade.hubId,
    hubName,
    isAdmin: comrade.isAdmin,
    mustChangePassword: comrade.mustChangePassword,
    hasCompletedSetup: comrade.hasCompletedSetup,
  };
  return authenticatedComradeSchema.parse(candidate);
}
