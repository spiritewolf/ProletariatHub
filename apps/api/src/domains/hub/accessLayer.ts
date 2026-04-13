import type { PrismaClient } from '@proletariat-hub/database';
import { Prisma } from '@proletariat-hub/database';
import { TRPCError } from '@trpc/server';

import { parseHub } from './mapper';
import { updateOneHub } from './mutations';
import { findUniqueHub } from './queries';
import type { FindHubWhereUniqueInput, Hub, UpdateOneHubInput } from './types';

export class HubAccessLayer {
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

  async findUnique(params: { where: FindHubWhereUniqueInput }): Promise<Hub> {
    return this.returnOrThrowError(async () => {
      const hubDbRecord = await findUniqueHub({ db: this.db, where: params.where });
      return parseHub(hubDbRecord);
    });
  }

  async updateOne(params: {
    where: FindHubWhereUniqueInput;
    data: UpdateOneHubInput;
  }): Promise<Hub> {
    return this.returnOrThrowError(async () => {
      const hubDbRecord = await updateOneHub({
        db: this.db,
        where: params.where,
        data: params.data,
      });
      return parseHub(hubDbRecord);
    });
  }
}
