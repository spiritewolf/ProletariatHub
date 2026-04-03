import { serviceTilesListResponseSchema } from '@proletariat-hub/contracts';
import { useQuery } from '@tanstack/react-query';

import { DocsApiPaths } from '@/features/docs/docsApiPaths';
import { docsQueryKeys } from '@/features/docs/docsQueryKeys';
import { apiJsonValidated } from '@/lib/api';

export function useServiceTiles() {
  return useQuery({
    queryKey: docsQueryKeys.serviceTiles,
    queryFn: async () => {
      const data = await apiJsonValidated(
        DocsApiPaths.serviceTiles,
        serviceTilesListResponseSchema,
      );
      return data.serviceTiles;
    },
  });
}
