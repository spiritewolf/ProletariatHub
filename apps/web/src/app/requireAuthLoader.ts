import { type Comrade, ComradeOnboardStatus } from '@proletariat-hub/web/shared';
import { trpcQueryUtils } from '@proletariat-hub/web/shared/lib/trpc';
import { TRPCClientError } from '@trpc/client';
import { redirect } from 'react-router-dom';

export type RequireAuthLoaderOptions = {
  onboardingIncompleteOnly?: boolean;
};

export function requireAuthLoader(options?: RequireAuthLoaderOptions) {
  return async (): Promise<{ comrade: Comrade } | ReturnType<typeof redirect>> => {
    try {
      await trpcQueryUtils.auth.findUniqueComradeFromSession.ensureData(undefined, {
        staleTime: Infinity,
        retry: false,
      });
    } catch (error: unknown) {
      if (error instanceof TRPCClientError) {
        return redirect('/login');
      }
      return redirect('/login?reason=api_unreachable');
    }

    const comrade = trpcQueryUtils.auth.findUniqueComradeFromSession.getData(undefined) ?? null;
    if (comrade === null) {
      return redirect('/login');
    }
    const setupOnly = options?.onboardingIncompleteOnly === true;
    if (setupOnly && comrade.onboardStatus === ComradeOnboardStatus.COMPLETE) {
      return redirect('/');
    }
    if (!setupOnly && comrade.onboardStatus !== ComradeOnboardStatus.COMPLETE) {
      return redirect('/setup');
    }
    return { comrade };
  };
}
