import type { Comrade } from '@proletariat-hub/shared';
import { TRPCError } from '@trpc/server';

import type { ApiRequest } from '../context';
import type { ComradeAccessLayer } from '../domains/comrade/accessLayer';

export async function requireSessionComrade(params: {
  req: ApiRequest;
  comradeAccessLayer: ComradeAccessLayer;
}): Promise<Comrade> {
  const comradeId = params.req.session.get('comradeId');
  if (comradeId === undefined) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }

  try {
    return await params.comradeAccessLayer.findUnique({ where: { id: comradeId } });
  } catch {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }
}
