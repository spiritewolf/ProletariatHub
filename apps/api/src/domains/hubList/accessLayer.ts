import type { PrismaClient } from '@proletariat-hub/database';
import type { HubList } from '@proletariat-hub/types';

import type { DomainErrorHandler } from '../../shared/util/prismaErrorHandler';
import { parseHubList } from './mapper';
import { findUniqueHubListByHubId } from './queries';

export class HubListAccessLayer {
  constructor(
    private readonly db: PrismaClient,
    private readonly domainError: DomainErrorHandler,
  ) {}

  async findUnique(params: { where: { hubId: string } }): Promise<HubList> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const hubListDbRecord = await findUniqueHubListByHubId({
        db: this.db,
        where: params.where,
      });
      return parseHubList(hubListDbRecord);
    });
  }
}
