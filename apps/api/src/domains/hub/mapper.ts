import type { Hub, HubDbRecord } from './types';

export function parseHub(hubDbRecord: HubDbRecord): Hub {
  return {
    id: hubDbRecord.id,
    name: hubDbRecord.name,
    createdAt: hubDbRecord.createdAt,
    updatedAt: hubDbRecord.updatedAt,
    settings: {
      id: hubDbRecord.settings.id,
      createdAt: hubDbRecord.settings.createdAt,
      updatedAt: hubDbRecord.settings.updatedAt,
      dashboardTheme: hubDbRecord.settings.dashboardTheme,
      updatedById: hubDbRecord.settings.updatedById,
    },
  };
}
