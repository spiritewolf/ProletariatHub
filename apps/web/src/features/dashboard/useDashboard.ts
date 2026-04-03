import { dashboardSummarySchema } from '@proletariat-hub/contracts';
import { useQuery } from '@tanstack/react-query';

import { apiJsonValidated } from '@/lib/api';

import { DashboardApiResource } from './dashboardApiPaths';
import { dashboardQueryKeys } from './dashboardQueryKeys';

export function useDashboardSummary() {
  return useQuery({
    queryKey: dashboardQueryKeys.summary,
    queryFn: () => apiJsonValidated(DashboardApiResource.Summary, dashboardSummarySchema),
  });
}
