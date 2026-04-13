import { parseComrade } from '@proletariat-hub/api/domains/comrade/mapper';
import {
  findFirstComrade,
  findFirstComradeRecord,
} from '@proletariat-hub/api/domains/comrade/queries';
import type { PrismaClient } from '@proletariat-hub/database';
import { type Comrade } from '@proletariat-hub/shared';
import { TRPCError } from '@trpc/server';

import type { ApiRequest } from '../../context';
import { verifyPassword } from './password-hash';

export async function findFirstComradeFromSession(params: {
  db: PrismaClient;
  req: ApiRequest;
}): Promise<Comrade | null> {
  const comradeId = params.req.session.get('comradeId');
  if (comradeId === undefined) {
    return null;
  }
  return findFirstComrade({ db: params.db, where: { id: comradeId } });
}

export async function createOneLoginSession(params: {
  db: PrismaClient;
  req: ApiRequest;
  input: { username: string; password: string };
}): Promise<Comrade> {
  const comradeDbRecord = await findFirstComradeRecord({
    db: params.db,
    where: { username: params.input.username },
  });
  if (comradeDbRecord === null) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid username or password',
    });
  }
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
}

export async function deleteOneLoginSession(params: { req: ApiRequest }): Promise<void> {
  await params.req.session.destroy();
}
