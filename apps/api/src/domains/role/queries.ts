import type { PrismaClient } from '@proletariat-hub/database';

import type { FindRoleWhereUniqueInput, RoleDbRecord } from './types';

export async function findUniqueRole(params: {
  db: PrismaClient;
  where: FindRoleWhereUniqueInput;
}): Promise<RoleDbRecord> {
  return params.db.role.findFirstOrThrow({
    where: {
      roleType: params.where.roleType,
      archivedAt: null,
    },
  });
}
