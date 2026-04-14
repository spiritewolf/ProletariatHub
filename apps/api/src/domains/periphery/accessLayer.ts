import type { PrismaClient } from '@proletariat-hub/database';
import type { Periphery } from '@proletariat-hub/types';

import type { DomainErrorHandler } from '../../shared/util/prismaErrorHandler';
import { parsePeriphery } from './mapper';
import { createOnePeriphery, updateOnePeriphery } from './mutations';
import { findManyPeriphery } from './queries';
import type { CreateOnePeripheryInput, UpdateOnePeripheryInput } from './schemas';
import type { UpdateOnePeripheryData } from './types';

type UpdateOnePeripheryPatch = Omit<UpdateOnePeripheryInput, 'id'>;

export class PeripheryAccessLayer {
  constructor(
    private readonly db: PrismaClient,
    private readonly domainError: DomainErrorHandler,
  ) {}

  async findMany(params: { where: { hubId: string } }): Promise<Periphery[]> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const peripheryDbRecords = await findManyPeriphery({ db: this.db, where: params.where });
      return peripheryDbRecords.map(parsePeriphery);
    });
  }

  async createOne(params: {
    hubId: string;
    comradeId: string;
    input: CreateOnePeripheryInput;
  }): Promise<Periphery> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const { hubId, comradeId, input } = params;

      const hubPeripheryDbRecord = await createOnePeriphery({
        db: this.db,
        data: {
          name: input.name,
          peripheryCategory: input.peripheryCategory,
          notes: input.notes,
          hubId,
          createdById: comradeId,
          settings: {
            birthDate: input.birthDate,
            avatarIcon: input.avatarIcon,
            avatarColor: null,
            phoneNumber: input.phoneNumber,
            email: input.email,
          },
        },
      });

      return parsePeriphery(hubPeripheryDbRecord);
    });
  }

  async updateOne(params: {
    where: { id: string };
    input: UpdateOnePeripheryPatch;
  }): Promise<Periphery> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const { where, input } = params;

      const settingsUpdateInner = {
        birthDate: input.birthDate,
        avatarIcon: input.avatarIcon,
        phoneNumber: input.phoneNumber,
        email: input.email,
      };
      const hasSettingsChange = Object.values(settingsUpdateInner).some((v) => v !== undefined);

      const data: UpdateOnePeripheryData = {
        name: input.name,
        peripheryCategory: input.peripheryCategory,
        notes: input.notes,
        settings: hasSettingsChange ? { update: settingsUpdateInner } : undefined,
      };

      const updatedHubPeripheryDbRecord = await updateOnePeriphery({
        db: this.db,
        where: { id: where.id },
        data,
      });

      return parsePeriphery(updatedHubPeripheryDbRecord);
    });
  }
}
