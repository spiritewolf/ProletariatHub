import type { PrismaClient } from '@proletariat-hub/database';

import type { DomainErrorHandler } from '../../shared/util/prismaErrorHandler';
import { parseHub } from './mapper';
import { updateOneHub } from './mutations';
import { findUniqueHub } from './queries';
import type { FindHubWhereUniqueInput, Hub, UpdateOneHubInput } from './types';

export class HubAccessLayer {
  constructor(
    private readonly db: PrismaClient,
    private readonly domainError: DomainErrorHandler,
  ) {}

  // ──────────────────────────────────────────────
  // DB ACCESS
  // ──────────────────────────────────────────────

  async findUnique(params: { where: FindHubWhereUniqueInput }): Promise<Hub> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const hubDbRecord = await findUniqueHub({ db: this.db, where: params.where });
      return parseHub(hubDbRecord);
    });
  }

  async updateOne(params: {
    where: FindHubWhereUniqueInput;
    data: UpdateOneHubInput;
  }): Promise<Hub> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const hubDbRecord = await updateOneHub({
        db: this.db,
        where: params.where,
        data: params.data,
      });
      return parseHub(hubDbRecord);
    });
  }
}
