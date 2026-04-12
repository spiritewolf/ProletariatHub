// eslint-disable-next-line no-restricted-imports
import { SetupWizardFormValues } from '@proletariat-hub/web/features/setup-wizard/schema';
import {
  type Comrade,
  ComradeOnboardStatus,
  ComradeRole,
} from '@proletariat-hub/web/shared/types/comrade';
import { z } from 'zod';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { ComradeIconType } from '../../types';

const MOCK_COMRADE_ID = '7c9e6679-7425-40de-944b-e07fc1f90ae7';

const persistedComradeSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  username: z.string(),
  password: z.string(),
  role: z.enum([ComradeRole.ADMIN, ComradeRole.MEMBER]),
  onboardStatus: z.enum([
    ComradeOnboardStatus.PENDING,
    ComradeOnboardStatus.IN_PROGRESS,
    ComradeOnboardStatus.COMPLETE,
  ]),
  phoneNumber: z.string().optional(),
  email: z.string().optional(),
  signalUsername: z.string().optional(),
  telegramUsername: z.string().optional(),
});

const recruitAvatarIconPersistSchema = z.enum([
  ComradeIconType.ATOM,
  ComradeIconType.CROWN,
  ComradeIconType.EGG_FRIED,
  ComradeIconType.HAND_FIST,
  ComradeIconType.MENU,
  ComradeIconType.PALETTE,
  ComradeIconType.SNAIL,
  ComradeIconType.USER,
]);

const mockHubRecruitSchema = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(),
  avatarIcon: recruitAvatarIconPersistSchema.optional(),
  phoneNumber: z.string().optional(),
  email: z.string().optional(),
  signalUsername: z.string().optional(),
  telegramUsername: z.string().optional(),
  role: z.enum([ComradeRole.MEMBER]),
});

export type MockHubRecruit = z.infer<typeof mockHubRecruitSchema>;

const persistedStateRecordSchema = z.record(z.string(), z.unknown());

type AuthStoreMockState = {
  comrade: Comrade | null;
  hubName: string | null;
  mockRecruits: MockHubRecruit[];
  createLoginSession: (username: string, password: string) => Comrade;
  endLoginSession: () => void;
  completeSetup: (data: SetupWizardFormValues) => void;
};

function resolveRoleForMockLogin(trimmedUsername: string): ComradeRole {
  if (trimmedUsername.toLowerCase() === 'member') {
    return ComradeRole.MEMBER;
  }
  return ComradeRole.ADMIN;
}

export const useAuthStoreMock = create<AuthStoreMockState>()(
  persist(
    (set): AuthStoreMockState => ({
      comrade: null,
      hubName: null,
      mockRecruits: [],
      createLoginSession: (username: string, password: string): Comrade => {
        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();
        if (trimmedUsername === '' || trimmedPassword === '') {
          throw new Error('Username and password must be non-empty.');
        }
        const now = new Date();
        const comrade: Comrade = {
          id: MOCK_COMRADE_ID,
          createdAt: now,
          updatedAt: now,
          username: trimmedUsername,
          password: trimmedPassword,
          role: resolveRoleForMockLogin(trimmedUsername),
          onboardStatus: ComradeOnboardStatus.PENDING,
        };
        set({ comrade, hubName: null, mockRecruits: [] });
        return comrade;
      },
      endLoginSession: (): void => {
        set({ comrade: null, hubName: null, mockRecruits: [] });
      },
      completeSetup: (data: SetupWizardFormValues): void => {
        set((state) => {
          const prev = state.comrade;
          if (prev === null) {
            throw new Error('Cannot complete setup without a logged-in comrade.');
          }
          const now = new Date();
          const trimOptional = (value: string | undefined): string | undefined => {
            const t = (value ?? '').trim();
            return t === '' ? undefined : t;
          };
          const emailTrimmed = (data.email ?? '').trim();
          const mockRecruits: MockHubRecruit[] = data.recruits.map((r) => ({
            id: crypto.randomUUID(),
            username: r.username.trim(),
            password: 'password',
            avatarIcon: r.icon,
            role: ComradeRole.MEMBER,
          }));
          return {
            comrade: {
              ...prev,
              username: data.username.trim(),
              password: data.newPassword,
              updatedAt: now,
              onboardStatus: ComradeOnboardStatus.COMPLETE,
              phoneNumber: trimOptional(data.phoneNumber),
              email: emailTrimmed === '' ? undefined : emailTrimmed,
              signalUsername: trimOptional(data.signalUsername),
              telegramUsername: trimOptional(data.telegramUsername),
            },
            hubName: data.hubName.trim(),
            mockRecruits,
          };
        });
      },
    }),
    {
      name: 'proletariat-hub-auth-mock',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state: AuthStoreMockState) => ({
        comrade: state.comrade,
        hubName: state.hubName,
        mockRecruits: state.mockRecruits,
      }),
      merge: (persistedState, currentState): AuthStoreMockState => {
        const asRecord = persistedStateRecordSchema.safeParse(persistedState);
        if (!asRecord.success) {
          return currentState;
        }
        const record = asRecord.data;
        if (!Object.hasOwn(record, 'comrade')) {
          return currentState;
        }
        const rawComrade: unknown = record['comrade'];
        if (rawComrade === undefined) {
          return currentState;
        }
        if (rawComrade === null) {
          return { ...currentState, comrade: null, hubName: null, mockRecruits: [] };
        }
        const parsed = persistedComradeSchema.safeParse(rawComrade);
        if (!parsed.success) {
          return { ...currentState, comrade: null, hubName: null, mockRecruits: [] };
        }
        const hubNameRaw = record['hubName'];
        const hubName =
          typeof hubNameRaw === 'string' || hubNameRaw === null ? hubNameRaw : currentState.hubName;
        const rawRecruits = record['mockRecruits'];
        const recruitsParsed = z.array(mockHubRecruitSchema).safeParse(rawRecruits);
        const mockRecruits = recruitsParsed.success
          ? recruitsParsed.data
          : currentState.mockRecruits;
        return {
          ...currentState,
          comrade: parsed.data,
          hubName,
          mockRecruits,
        };
      },
    },
  ),
);
