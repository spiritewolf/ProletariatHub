import type { PrismaClient } from '@proletariat-hub/database';

import type {
  ComradeSettingsConfigDbRecord,
  FindComradeSettingsConfigWhereUniqueInput,
} from './types';

export async function findUniqueComradeSettingsConfig(params: {
  db: PrismaClient;
  where: FindComradeSettingsConfigWhereUniqueInput;
}): Promise<ComradeSettingsConfigDbRecord> {
  return params.db.comradeSettingsConfig.findUniqueOrThrow({
    where: { id: params.where.id },
  });
}
