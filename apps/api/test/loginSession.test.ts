import { ComradeOnboardStatus, ComradeRole } from '@proletariat-hub/shared';
import { TRPCError } from '@trpc/server';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import type { ApiRequest } from '../src/context';
import { hashPassword } from '../src/domains/auth/passwordHash';
import { createOneLoginSession } from '../src/domains/auth/session';
import type { ComradeAccessLayer } from '../src/domains/comrade/accessLayer';
import type { ComradeDbRecord } from '../src/domains/comrade/types';

const COMRADE_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const SETTINGS_ID = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const ROLE_ID = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';

function mockComradeRecord(passwordHash: string): ComradeDbRecord {
  return {
    id: COMRADE_ID,
    createdAt: new Date('2020-01-01T00:00:00.000Z'),
    updatedAt: new Date('2020-01-02T00:00:00.000Z'),
    archivedAt: null,
    username: 'alice',
    password: passwordHash,
    onboardStatus: ComradeOnboardStatus.PENDING,
    settingsId: SETTINGS_ID,
    hubId: null,
    roleId: ROLE_ID,
    role: {
      id: ROLE_ID,
      createdAt: new Date('2020-01-01T00:00:00.000Z'),
      updatedAt: new Date('2020-01-02T00:00:00.000Z'),
      archivedAt: null,
      roleType: ComradeRole.ADMIN,
      description: null,
    },
    settings: {
      id: SETTINGS_ID,
      createdAt: new Date('2020-01-01T00:00:00.000Z'),
      updatedAt: new Date('2020-01-02T00:00:00.000Z'),
      archivedAt: null,
      avatarIcon: null,
      avatarColor: null,
      phoneNumber: null,
      email: null,
      signalUsername: null,
      telegramUsername: null,
    },
  } satisfies ComradeDbRecord;
}

function createSessionMock(): {
  req: ApiRequest;
  getComradeId: () => string | undefined;
  regenerate: ReturnType<typeof vi.fn>;
  save: ReturnType<typeof vi.fn>;
} {
  let comradeId: string | undefined;
  const regenerate = vi.fn(async (): Promise<void> => {
    comradeId = undefined;
  });
  const set = vi.fn((_key: 'comradeId', value: string): void => {
    comradeId = value;
  });
  const get = vi.fn((_key: 'comradeId'): string | undefined => comradeId);
  const save = vi.fn(async (): Promise<void> => {});
  const destroy = vi.fn(async (): Promise<void> => {});
  const session: ApiRequest['session'] = { regenerate, set, get, save, destroy };
  return { req: { session }, getComradeId: () => comradeId, regenerate, save };
}

describe('createOneLoginSession', () => {
  let passwordHash: string;

  beforeAll(async (): Promise<void> => {
    passwordHash = await hashPassword('secret-pass');
  });

  it('sets session comrade id and returns the comrade when credentials match', async (): Promise<void> => {
    const comradeAccessLayer = mockDeep<ComradeAccessLayer>();
    comradeAccessLayer.findUniqueComradeUnsafeRaw.mockResolvedValue(
      mockComradeRecord(passwordHash),
    );
    const { req, getComradeId, regenerate, save } = createSessionMock();

    const comrade = await createOneLoginSession({
      comradeAccessLayer,
      req,
      input: { username: 'alice', password: 'secret-pass' },
    });

    expect(comrade.id).toBe(COMRADE_ID);
    expect(comrade.username).toBe('alice');
    expect(regenerate).toHaveBeenCalled();
    expect(save).toHaveBeenCalled();
    expect(getComradeId()).toBe(COMRADE_ID);
  });

  it('rejects when the password does not match', async (): Promise<void> => {
    const comradeAccessLayer = mockDeep<ComradeAccessLayer>();
    comradeAccessLayer.findUniqueComradeUnsafeRaw.mockResolvedValue(
      mockComradeRecord(passwordHash),
    );
    const { req } = createSessionMock();

    await expect(
      createOneLoginSession({
        comradeAccessLayer,
        req,
        input: { username: 'alice', password: 'wrong-pass' },
      }),
    ).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
  });

  it('rejects when no comrade exists for the username', async (): Promise<void> => {
    const comradeAccessLayer = mockDeep<ComradeAccessLayer>();
    comradeAccessLayer.findUniqueComradeUnsafeRaw.mockRejectedValue(
      new TRPCError({ code: 'NOT_FOUND', message: 'Record not found' }),
    );
    const { req } = createSessionMock();

    await expect(
      createOneLoginSession({
        comradeAccessLayer,
        req,
        input: { username: 'nobody', password: 'secret-pass' },
      }),
    ).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
  });
});
