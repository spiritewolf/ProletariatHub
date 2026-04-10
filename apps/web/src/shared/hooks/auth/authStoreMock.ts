import {
  type Comrade,
  ComradeRole,
  OnboardStatus,
} from '@proletariat-hub/web/shared/types/comrade';
import { z } from 'zod';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const MOCK_COMRADE_ID = '7c9e6679-7425-40de-944b-e07fc1f90ae7';

const persistedComradeSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  username: z.string(),
  password: z.string(),
  role: z.enum([ComradeRole.ADMIN, ComradeRole.MEMBER]),
  onboardStatus: z.enum([OnboardStatus.PENDING, OnboardStatus.IN_PROGRESS, OnboardStatus.COMPLETE]),
  phoneNumber: z.string().optional(),
  email: z.string().optional(),
  signalUsername: z.string().optional(),
  telegramUsername: z.string().optional(),
});

const persistedStateRecordSchema = z.record(z.string(), z.unknown());

type AuthStoreMockState = {
  comrade: Comrade | null;
  createLoginSession: (username: string, password: string) => Comrade;
  endLoginSession: () => void;
};

export const useAuthStoreMock = create<AuthStoreMockState>()(
  persist(
    (set): AuthStoreMockState => ({
      comrade: null,
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
          role: ComradeRole.ADMIN,
          onboardStatus: OnboardStatus.COMPLETE,
        };
        set({ comrade });
        return comrade;
      },
      endLoginSession: (): void => {
        set({ comrade: null });
      },
    }),
    {
      name: 'proletariat-hub-auth-mock',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state: AuthStoreMockState) => ({
        comrade: state.comrade,
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
          return { ...currentState, comrade: null };
        }
        const parsed = persistedComradeSchema.safeParse(rawComrade);
        if (!parsed.success) {
          return { ...currentState, comrade: null };
        }
        return { ...currentState, comrade: parsed.data };
      },
    },
  ),
);
