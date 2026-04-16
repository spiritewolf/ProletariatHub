import type {
  HubDbRecord as HubDbRecordBase,
  HubSettingsDbRecord,
} from '@proletariat-hub/database';

export interface HubDbRecord extends HubDbRecordBase {
  settings: HubSettingsDbRecord;
}

export type HubSettings = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  dashboardTheme: string;
  updatedById: string | null;
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
