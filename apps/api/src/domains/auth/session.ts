import { type Comrade } from '@proletariat-hub/types';
import { TRPCError } from '@trpc/server';

import type { ApiRequest } from '../../types/context';
import type { ComradeAccessLayer } from '../comrade/accessLayer';
import { parseComrade } from '../comrade/mapper';
import { verifyPassword } from './passwordHash';

export async function findUniqueComradeFromSession(params: {
  comradeAccessLayer: ComradeAccessLayer;
  req: ApiRequest;
}): Promise<Comrade | null> {
  const comradeId = params.req.session.get('comradeId');
  if (comradeId === undefined) {
    return null;
  }
  try {
    return await params.comradeAccessLayer.findUnique({ where: { id: comradeId } });
  } catch (error: unknown) {
    if (error instanceof TRPCError && error.code === 'NOT_FOUND') {
      return null;
    }
    throw error;
  }
}

export async function createOneLoginSession(params: {
  comradeAccessLayer: ComradeAccessLayer;
  req: ApiRequest;
  input: { username: string; password: string };
}): Promise<Comrade> {
  try {
    const comradeDbRecord = await params.comradeAccessLayer.findUniqueComradeUnsafeRaw({
      username: params.input.username,
    });
    const passwordOk = await verifyPassword(params.input.password, comradeDbRecord.password);
    if (!passwordOk) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid username or password',
      });
    }
    await params.req.session.regenerate();
    params.req.session.set('comradeId', comradeDbRecord.id);
    await params.req.session.save();
    return parseComrade(comradeDbRecord);
  } catch (error: unknown) {
    if (error instanceof TRPCError) {
      if (error.code === 'UNAUTHORIZED') {
        throw error;
      }
      if (error.code === 'NOT_FOUND') {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid username or password',
        });
      }
      throw error;
    }
    throw error;
  }
}

export async function deleteOneLoginSession(params: { req: ApiRequest }): Promise<void> {
  await params.req.session.destroy();
}
