import { serviceTilesListResponseSchema } from '@proletariat-hub/contracts';
import { useQuery } from '@tanstack/react-query';

import { apiJsonValidated } from '@/lib/api';

import { MEDIA_SERVICE_TILES_API_PATH } from './mediaApiPaths';
import { mediaQueryKeys } from './mediaQueryKeys';

export function useServiceTiles() {
  return useQuery({
    queryKey: mediaQueryKeys.serviceTiles,
    queryFn: async () => {
      const data = await apiJsonValidated(
        MEDIA_SERVICE_TILES_API_PATH,
        serviceTilesListResponseSchema,
      );
      return data.serviceTiles;
    },
  });
}
