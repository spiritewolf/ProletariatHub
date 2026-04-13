import type { AppRouter } from '@proletariat-hub/api/router';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCQueryUtils, createTRPCReact } from '@trpc/react-query';
import superjson from 'superjson';

import { appQueryClient } from './queryClient';

export const trpc = createTRPCReact<AppRouter>();

function createLinks() {
  return [
    httpBatchLink({
      url: `${import.meta.env.VITE_API_URL}/trpc`,
      fetch(url, options) {
        return fetch(url, { ...options, credentials: 'include' });
      },
      transformer: superjson,
    }),
  ];
}

export const appTrpcClient = createTRPCClient<AppRouter>({
  links: createLinks(),
});

export const trpcQueryUtils = createTRPCQueryUtils({
  queryClient: appQueryClient,
  client: appTrpcClient,
});
