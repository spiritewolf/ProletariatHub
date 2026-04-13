import type { PrismaClient } from '@proletariat-hub/database';

import type { ComradeDbRecord, FindComradeWhereInput, FindComradeWhereUniqueInput } from './types';
import { COMRADE_DEFAULT_INCLUDE } from './types';

export function resolveComradeUniqueWhere(
  where: FindComradeWhereUniqueInput,
): { id: string } | { username: string } {
  if (where.id !== undefined && where.id !== '') {
    return { id: where.id };
  }
  if (where.username !== undefined && where.username !== '') {
    return { username: where.username };
  }
  throw new Error('resolveComradeUniqueWhere requires id or username');
}

export async function findUniqueComradeUnsafeRaw(params: {
  db: PrismaClient;
  username: string;
}): Promise<ComradeDbRecord> {
  return params.db.comrade.findFirstOrThrow({
    where: {
      username: params.username,
      archivedAt: null,
    },
    include: COMRADE_DEFAULT_INCLUDE,
  });
}

export async function findManyComrades(params: {
  db: PrismaClient;
  where: FindComradeWhereInput;
}): Promise<ComradeDbRecord[]> {
  const { db, where } = params;

  if (where.ids !== undefined && where.ids.length === 0) {
    return [];
  }

  const hasIds = where.ids !== undefined && where.ids.length > 0;
  const hasHubId = where.hubId !== undefined;

  if (!hasIds && !hasHubId) {
    throw new Error('findManyComrades requires ids or hubId');
  }

  return db.comrade.findMany({
    where: {
      id: hasIds ? { in: where.ids } : undefined,
      hubId: where.hubId,
      archivedAt: null,
    },
    include: COMRADE_DEFAULT_INCLUDE,
  });
}

export async function findUniqueComrade(params: {
  db: PrismaClient;
  where: FindComradeWhereUniqueInput;
}): Promise<ComradeDbRecord> {
  const { db, where } = params;
  if (where.id !== undefined && where.id !== '') {
    return db.comrade.findFirstOrThrow({
      where: {
        id: where.id,
        archivedAt: null,
      },
      include: COMRADE_DEFAULT_INCLUDE,
    });
  }
  if (where.username !== undefined && where.username !== '') {
    return db.comrade.findFirstOrThrow({
      where: {
        username: where.username,
        archivedAt: null,
      },
      include: COMRADE_DEFAULT_INCLUDE,
    });
  }
  throw new Error('findUniqueComrade requires id or username');
}
