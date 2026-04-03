import { accountPatchBodySchema, accountPatchResponseSchema } from '@proletariat-hub/contracts';
import { useCallback } from 'react';
import { z } from 'zod';

import { apiJsonValidated } from '@/lib/api';

export function useChangePassword() {
  const updateAccount = useCallback(async (body: z.infer<typeof accountPatchBodySchema>) => {
    await apiJsonValidated('/api/auth/account', accountPatchResponseSchema, {
      method: 'PATCH',
      json: body,
    });
  }, []);

  return { updateAccount };
}
