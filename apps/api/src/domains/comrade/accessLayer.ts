import type { PrismaClient } from '@proletariat-hub/database';
import type { Comrade } from '@proletariat-hub/types';
import { ComradeOnboardStatus, ComradeRole } from '@proletariat-hub/types';

import type { DomainErrorHandler } from '../../shared/util/prismaErrorHandler';
import type { HubAccessLayer } from '../hub/accessLayer';
import type { RoleAccessLayer } from '../role/accessLayer';
import { parseComrade } from './mapper';
import { createManyComrades, updateOneComrade } from './mutations';
import { findManyComrades, findUniqueComrade, findUniqueComradeUnsafeRaw } from './queries';
import type { CompleteAdminSetupInput, CompleteMemberSetupInput } from './schemas';
import type {
  ComradeDbRecord,
  CreateOneComradeInput,
  FindComradeWhereInput,
  FindComradeWhereUniqueInput,
  UpdateOneComradeInput,
} from './types';

export class ComradeAccessLayer {
  constructor(
    private readonly db: PrismaClient,
    private readonly domainError: DomainErrorHandler,
    private readonly accessLayers: {
      hubAccessLayer: HubAccessLayer;
      roleAccessLayer: RoleAccessLayer;
    },
  ) {}

  // ──────────────────────────────────────────────
  // DB ACCESS
  // ──────────────────────────────────────────────

  async findUnique(params: { where: FindComradeWhereUniqueInput }): Promise<Comrade> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const comradeDbRecord = await findUniqueComrade({ db: this.db, where: params.where });
      return parseComrade(comradeDbRecord);
    });
  }

  async findMany(params: { where: FindComradeWhereInput }): Promise<Comrade[]> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const comradeDbRecords = await findManyComrades({ db: this.db, where: params.where });
      return comradeDbRecords.map(parseComrade);
    });
  }

  async findUniqueComradeUnsafeRaw(params: { username: string }): Promise<ComradeDbRecord> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      return findUniqueComradeUnsafeRaw({ db: this.db, username: params.username });
    });
  }

  async updateOne(params: {
    where: FindComradeWhereUniqueInput;
    data: UpdateOneComradeInput;
  }): Promise<Comrade> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const comradeDbRecord = await updateOneComrade({
        db: this.db,
        where: params.where,
        data: params.data,
      });
      return parseComrade(comradeDbRecord);
    });
  }

  async updatePassword(params: {
    where: FindComradeWhereUniqueInput;
    newPassword: string;
  }): Promise<void> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      await updateOneComrade({
        db: this.db,
        where: params.where,
        data: { password: params.newPassword },
      });
    });
  }

  async createMany(params: { data: CreateOneComradeInput[] }): Promise<Comrade[]> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const ids = await createManyComrades({ db: this.db, data: params.data });
      if (ids.length === 0) {
        return [];
      }
      return this.findMany({ where: { ids } });
    });
  }

  // ──────────────────────────────────────────────
  // WORKFLOWS
  // ──────────────────────────────────────────────

  async completeAdminSetup(params: {
    comrade: Comrade;
    input: CompleteAdminSetupInput;
  }): Promise<Comrade> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const { comrade, input } = params;

      let updatedComrade = await this.updateOne({
        where: { id: comrade.id },
        data: {
          username: input.username,
          password: input.newPassword,
          onboardStatus: ComradeOnboardStatus.COMPLETE,
          settings: {
            email: input.email,
            phoneNumber: input.phoneNumber,
            signalUsername: input.signalUsername,
            telegramUsername: input.telegramUsername,
          },
        },
      });

      const { hubId } = updatedComrade;

      await this.accessLayers.hubAccessLayer.updateOne({
        where: { id: hubId },
        data: { name: input.hubName },
      });

      if (input.recruits.length > 0) {
        const memberRole = await this.accessLayers.roleAccessLayer.findUnique({
          where: { roleType: ComradeRole.MEMBER },
        });
        await this.createMany({
          data: input.recruits.map((recruit) => ({
            username: recruit.username,
            avatarIcon: recruit.icon,
            hubId,
            roleId: memberRole.id,
          })),
        });
      }

      updatedComrade = await this.findUnique({ where: { id: comrade.id } });
      return updatedComrade;
    });
  }

  async completeMemberSetup(params: {
    comrade: Comrade;
    input: CompleteMemberSetupInput;
  }): Promise<Comrade> {
    return this.domainError.returnOrThrowTRPCError(async () => {
      const { comrade, input } = params;

      return this.updateOne({
        where: { id: comrade.id },
        data: {
          username: input.username,
          password: input.newPassword,
          onboardStatus: ComradeOnboardStatus.COMPLETE,
          settings: {
            email: input.email,
            phoneNumber: input.phoneNumber,
            signalUsername: input.signalUsername,
            telegramUsername: input.telegramUsername,
          },
        },
      });
    });
  }
}
