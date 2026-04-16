import type { PrismaClient } from '@proletariat-hub/database';
import type { Comrade } from '@proletariat-hub/types';

import type { ComradeAccessLayer } from '../domains/comrade';
import type { ComradeSettingsAccessLayer } from '../domains/comradeSettings';
import type { HubAccessLayer } from '../domains/hub';
import type { HubInventoryAccessLayer } from '../domains/hubInventory';
import type { HubListAccessLayer } from '../domains/hubList';
import type { PeripheryAccessLayer } from '../domains/periphery';
import type { RoleAccessLayer } from '../domains/role';

export type SessionApi = {
  regenerate(): Promise<void>;
  set(key: 'comradeId', value: string): void;
  get(key: 'comradeId'): string | undefined;
  save(): Promise<void>;
  destroy(): Promise<void>;
};

export type ApiRequest = {
  session: SessionApi;
};

export interface SharedContext {
  req: ApiRequest;
  res: unknown;
  db: PrismaClient;
  redis: unknown;
  comradeAccessLayer: ComradeAccessLayer;
  comradeSettingsAccessLayer: ComradeSettingsAccessLayer;
  peripheryAccessLayer: PeripheryAccessLayer;
  hubListAccessLayer: HubListAccessLayer;
  hubInventoryAccessLayer: HubInventoryAccessLayer;
  hubAccessLayer: HubAccessLayer;
  roleAccessLayer: RoleAccessLayer;
}

export type PublicContext = SharedContext;

export interface PrivateContext extends SharedContext {
  comrade: Comrade;
}
