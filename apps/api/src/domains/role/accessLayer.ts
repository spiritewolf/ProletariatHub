import type { PrismaClient } from '@proletariat-hub/database';

import type { DomainErrorHandler } from '../../shared/util/prismaErrorHandler';
import { parseRole } from './mapper';
import { findUniqueRole } from './queries';
import type { FindRoleWhereUniqueInput, Role } from './types';

export class RoleAccessLayer {
  constructor(
    private readonly db: PrismaClient,
    private readonly domainError: DomainErrorHandler,
  ) {}

  // ──────────────────────────────────────────────
  // DB ACCESS
  // ──────────────────────────────────────────────

  async findUnique(params: { where: FindRoleWhereUniqueInput }): Promise<Role> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const roleDbRecord = await findUniqueRole({ db: this.db, where: params.where });
      return parseRole(roleDbRecord);
    });
  }
}
