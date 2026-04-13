import { findFirstComrade } from '@proletariat-hub/api/domains/comrade/queries';
import type { PrismaClient } from '@proletariat-hub/database';
import type { Comrade } from '@proletariat-hub/shared';
import { TRPCError } from '@trpc/server';

import type { ApiRequest } from '../context';

export async function requireSessionComrade(params: {
  db: PrismaClient;
  req: ApiRequest;
}): Promise<Comrade> {
  const comradeId = params.req.session.get('comradeId');
  if (comradeId === undefined) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }
  const comrade = await findFirstComrade({ db: params.db, where: { id: comradeId } });
  if (comrade === null) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }
  return comrade;
}
