import type { PrismaClient } from '@proletariat-hub/database';
import { Prisma } from '@proletariat-hub/database';
import { TRPCError } from '@trpc/server';

import { parseRole } from './mapper';
import { findUniqueRole } from './queries';
import type { FindRoleWhereUniqueInput, Role } from './types';

export class RoleAccessLayer {
  constructor(private readonly db: PrismaClient) {}

  /**
   * Catches Prisma errors and rethrows as human-readable TRPCErrors.
   */
  private async returnOrThrowError<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'A record with that value already exists',
          });
        }
        if (error.code === 'P2025') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Record not found',
          });
        }
      }
      throw error;
    }
  }

  // ──────────────────────────────────────────────
  // DB ACCESS
  // ──────────────────────────────────────────────

  async findUnique(params: { where: FindRoleWhereUniqueInput }): Promise<Role> {
    return this.returnOrThrowError(async () => {
      const roleDbRecord = await findUniqueRole({ db: this.db, where: params.where });
      return parseRole(roleDbRecord);
    });
  }
}
