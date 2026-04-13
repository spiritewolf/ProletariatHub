import type { Prisma } from '@proletariat-hub/database';

export const HUB_DEFAULT_INCLUDE = {
  settings: true,
} as const;

export type HubDbRecord = Prisma.HubGetPayload<{
  include: typeof HUB_DEFAULT_INCLUDE;
}>;

export type HubSettings = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  dashboardTheme: string;
  updatedById: string;
};

export type Hub = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  settings: HubSettings;
};

export type FindHubWhereUniqueInput = {
  id: string;
};

export type UpdateOneHubInput = {
  name?: string;
};
