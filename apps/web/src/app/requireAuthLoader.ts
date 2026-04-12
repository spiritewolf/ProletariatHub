import { useAuthStoreMock } from '@proletariat-hub/web/shared/hooks/auth/authStoreMock';
import { type Comrade, OnboardStatus } from '@proletariat-hub/web/shared/types/comrade';
import { redirect } from 'react-router-dom';

export type RequireAuthLoaderOptions = {
  onboardingIncompleteOnly?: boolean;
};

export function requireAuthLoader(options?: RequireAuthLoaderOptions) {
  return (): { comrade: Comrade } | ReturnType<typeof redirect> => {
    const comrade = useAuthStoreMock.getState().comrade;
    if (comrade === null) {
      return redirect('/login');
    }
    const setupOnly = options?.onboardingIncompleteOnly === true;
    if (setupOnly && comrade.onboardStatus === OnboardStatus.COMPLETE) {
      return redirect('/');
    }
    if (!setupOnly && comrade.onboardStatus !== OnboardStatus.COMPLETE) {
      return redirect('/setup');
    }
    return { comrade };
  };
}
