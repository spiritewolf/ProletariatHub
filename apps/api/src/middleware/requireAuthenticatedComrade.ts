import type { Comrade } from '@proletariat-hub/types';
import { TRPCError } from '@trpc/server';

import type { ComradeAccessLayer } from '../domains/comrade';
import type { ApiRequest } from '../types/context';

export async function requireAuthenticatedComrade(params: {
  req: ApiRequest;
  comradeAccessLayer: ComradeAccessLayer;
}): Promise<Comrade> {
  const comradeId = params.req.session.get('comradeId');
  if (comradeId === undefined) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }

  try {
    return await params.comradeAccessLayer.findUnique({ where: { id: comradeId } });
  } catch (error: unknown) {
    if (error instanceof TRPCError && error.code === 'NOT_FOUND') {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
    }
    throw error;
  }
}
