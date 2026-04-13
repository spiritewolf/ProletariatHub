import type { PrismaClient } from '@proletariat-hub/database';
import { ComradeOnboardStatus } from '@proletariat-hub/shared';

import { hashPassword } from '../auth/passwordHash';
import { trimToUndefined } from './helpers';
import { resolveComradeUniqueWhere } from './queries';
import type {
  ComradeDbRecord,
  CreateOneComradeInput,
  FindComradeWhereUniqueInput,
  UpdateOneComradeInput,
} from './types';
import { COMRADE_DEFAULT_INCLUDE } from './types';

const RECRUIT_DEFAULT_PASSWORD = 'password';

export async function updateOneComrade(params: {
  db: PrismaClient;
  where: FindComradeWhereUniqueInput;
  data: UpdateOneComradeInput;
}): Promise<ComradeDbRecord> {
  const { db, where, data } = params;
  const prismaWhere = resolveComradeUniqueWhere(where);
  const passwordHash = !data.password ? undefined : await hashPassword(data.password);

  const settingsUpdate =
    data.settings !== undefined
      ? {
          update: {
            email: trimToUndefined(data.settings.email) ?? null,
            phoneNumber: trimToUndefined(data.settings.phoneNumber) ?? null,
            signalUsername: trimToUndefined(data.settings.signalUsername) ?? null,
            telegramUsername: trimToUndefined(data.settings.telegramUsername) ?? null,
          },
        }
      : undefined;

  return await db.comrade.update({
    where: prismaWhere,
    data: {
      ...(data.username !== undefined ? { username: data.username } : {}),
      ...(passwordHash !== undefined ? { password: passwordHash } : {}),
      ...(data.onboardStatus !== undefined ? { onboardStatus: data.onboardStatus } : {}),
      ...(settingsUpdate !== undefined ? { settings: settingsUpdate } : {}),
    },
    include: COMRADE_DEFAULT_INCLUDE,
  });
}

export async function createManyComrades(params: {
  db: PrismaClient;
  data: CreateOneComradeInput[];
}): Promise<string[]> {
  const { db, data } = params;

  if (data.length === 0) {
    return [];
  }

  const passwordHash = await hashPassword(RECRUIT_DEFAULT_PASSWORD);

  const ids: string[] = [];

  for (const recruit of data) {
    const record = await db.comrade.create({
      data: {
        username: recruit.username,
        password: passwordHash,
        onboardStatus: ComradeOnboardStatus.PENDING,
        hub: { connect: { id: recruit.hubId } },
        role: { connect: { id: recruit.roleId } },
        settings: {
          create: {
            avatarIcon: recruit.avatarIcon,
          },
        },
      },
      select: { id: true },
    });
    ids.push(record.id);
  }

  return ids;
}
