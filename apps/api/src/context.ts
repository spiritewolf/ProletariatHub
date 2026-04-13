import type { PrismaClient } from '@proletariat-hub/database';

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

export type Context = {
  req: ApiRequest;
  res: unknown;
  db: PrismaClient;
  redis: unknown;
};
