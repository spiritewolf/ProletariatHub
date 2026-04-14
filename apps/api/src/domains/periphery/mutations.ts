import type {
  CreateOnePeripheryMutationData,
  HubPeripheryDb,
  PeripheryDbRecord,
  UpdateOnePeripheryData,
} from './types';
import { PERIPHERY_DEFAULT_INCLUDE } from './types';

export async function createOnePeriphery(params: {
  db: HubPeripheryDb;
  data: CreateOnePeripheryMutationData;
}): Promise<PeripheryDbRecord> {
  return params.db.hubPeriphery.create({
    data: {
      name: params.data.name,
      peripheryCategory: params.data.peripheryCategory,
      notes: params.data.notes,
      hub: { connect: { id: params.data.hubId } },
      createdBy: { connect: { id: params.data.createdById } },
      settings: {
        create: {
          birthDate: params.data.settings.birthDate,
          avatarIcon: params.data.settings.avatarIcon,
          avatarColor: params.data.settings.avatarColor,
          phoneNumber: params.data.settings.phoneNumber,
          email: params.data.settings.email,
        },
      },
    },
    include: PERIPHERY_DEFAULT_INCLUDE,
  });
}

export async function updateOnePeriphery(params: {
  db: HubPeripheryDb;
  where: { id: string };
  data: UpdateOnePeripheryData;
}): Promise<PeripheryDbRecord> {
  return params.db.hubPeriphery.update({
    where: { id: params.where.id },
    data: {
      name: params.data.name,
      peripheryCategory: params.data.peripheryCategory,
      notes: params.data.notes,
      settings: params.data.settings,
    },
    include: PERIPHERY_DEFAULT_INCLUDE,
  });
}
