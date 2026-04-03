import {
  hubPatchResponseSchema,
  setupCompleteResponseSchema,
  type SetupComradeBody,
  setupComradesListResponseSchema,
  setupCreateComradeResponseSchema,
} from '@proletariat-hub/contracts';
import { useCallback } from 'react';

import { apiJsonValidated } from '@/lib/api';

export function useSetup() {
  const fetchComrades = useCallback(async () => {
    const data = await apiJsonValidated('/api/setup/comrades', setupComradesListResponseSchema);
    return data.comrades;
  }, []);

  const saveHubName = useCallback(async (name: string) => {
    await apiJsonValidated('/api/setup/hub', hubPatchResponseSchema, {
      method: 'PATCH',
      json: { name },
    });
  }, []);

  const addComrade = useCallback(async (payload: SetupComradeBody) => {
    await apiJsonValidated('/api/setup/comrades', setupCreateComradeResponseSchema, {
      method: 'POST',
      json: payload,
    });
  }, []);

  const completeSetup = useCallback(async () => {
    await apiJsonValidated('/api/setup/complete', setupCompleteResponseSchema, {
      method: 'POST',
    });
  }, []);

  return { fetchComrades, saveHubName, addComrade, completeSetup };
}
