import { useAuthStoreMock } from '@proletariat-hub/web/shared/hooks/auth/authStoreMock';
import type { Comrade } from '@proletariat-hub/web/shared/types/comrade';
import { redirect } from 'react-router-dom';

export function requireAuthLoader(): { comrade: Comrade } | ReturnType<typeof redirect> {
  const comrade = useAuthStoreMock.getState().comrade;
  if (!comrade) {
    return redirect('/login');
  }
  return { comrade };
}
