import type { PrismaClient } from '@proletariat-hub/database';
import type { Comrade } from '@proletariat-hub/shared';

import { parseComrade } from './mapper';
import type {
  ComradeDbRecord,
  FindComradeWhereUniqueInput,
  FindComradeWhereUsernameInput,
} from './types';
import { COMRADE_DEFAULT_INCLUDE } from './types';

export async function findUniqueComrade(params: {
  db: PrismaClient;
  where: FindComradeWhereUniqueInput;
}): Promise<Comrade> {
  const comradeDbRecord = await params.db.comrade.findFirstOrThrow({
    where: { id: params.where.id, archivedAt: null },
    include: COMRADE_DEFAULT_INCLUDE,
  });
  return parseComrade(comradeDbRecord);
}

export async function findFirstComrade(params: {
  db: PrismaClient;
  where: FindComradeWhereUniqueInput;
}): Promise<Comrade | null> {
  const comradeDbRecord = await params.db.comrade.findFirst({
    where: { id: params.where.id, archivedAt: null },
    include: COMRADE_DEFAULT_INCLUDE,
  });
  if (comradeDbRecord === null) {
    return null;
  }
  return parseComrade(comradeDbRecord);
}

export async function findFirstComradeRecord(params: {
  db: PrismaClient;
  where: FindComradeWhereUsernameInput;
}): Promise<ComradeDbRecord | null> {
  return params.db.comrade.findFirst({
    where: { username: params.where.username.trim(), archivedAt: null },
    include: COMRADE_DEFAULT_INCLUDE,
  });
}
