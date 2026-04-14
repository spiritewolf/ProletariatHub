import type { PrismaClient } from '@proletariat-hub/database';
import type { Comrade, ComradeSettingsConfig } from '@proletariat-hub/types';

import type { DomainErrorHandler } from '../../shared/util/prismaErrorHandler';
import type { ComradeAccessLayer } from '../comrade/accessLayer';
import { parseComradeSettingsConfig } from './mapper';
import { updateOneComradeSettingsConfig } from './mutations';
import { findUniqueComradeSettingsConfig } from './queries';
import type { UpdateComradeSettingsInput } from './schemas';

export class ComradeSettingsAccessLayer {
  constructor(
    private readonly db: PrismaClient,
    private readonly domainError: DomainErrorHandler,
    private readonly accessLayers: { comradeAccessLayer: ComradeAccessLayer },
  ) {}

  async findUnique(params: { where: { id: string } }): Promise<ComradeSettingsConfig> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const comradeSettingsConfigDbRecord = await findUniqueComradeSettingsConfig({
        db: this.db,
        where: params.where,
      });
      return parseComradeSettingsConfig(comradeSettingsConfigDbRecord);
    });
  }

  async updateOne(params: {
    comrade: Comrade;
    input: UpdateComradeSettingsInput;
  }): Promise<ComradeSettingsConfig> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const { comrade, input } = params;
      const settingsId = comrade.settings.id;

      if (input.newPassword) {
        await this.accessLayers.comradeAccessLayer.updatePassword({
          where: { id: comrade.id },
          newPassword: input.newPassword,
        });
      }

      await updateOneComradeSettingsConfig({
        db: this.db,
        where: { id: settingsId },
        data: {
          email: input.email,
          phoneNumber: input.phoneNumber,
          signalUsername: input.signalUsername,
          telegramUsername: input.telegramUsername,
          birthDate: input.birthDate,
        },
      });

      return this.findUnique({ where: { id: settingsId } });
    });
  }
}
