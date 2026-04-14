import type { PrismaClient } from '@proletariat-hub/database';

import type { ComradeSettingsConfigDbRecord, UpdateComradeSettingsConfigData } from './types';

type ComradeSettingsDb = Pick<PrismaClient, 'comradeSettingsConfig'>;

export async function updateOneComradeSettingsConfig(params: {
  db: ComradeSettingsDb;
  where: { id: string };
  data: UpdateComradeSettingsConfigData;
}): Promise<ComradeSettingsConfigDbRecord> {
  return params.db.comradeSettingsConfig.update({
    where: { id: params.where.id },
    data: params.data,
  });
}
