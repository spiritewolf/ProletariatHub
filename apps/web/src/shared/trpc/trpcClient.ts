import type { AppRouter } from '@proletariat-hub/api/router';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCQueryUtils, createTRPCReact } from '@trpc/react-query';
import superjson from 'superjson';

import { appQueryClient } from './queryClient';

export const trpc = createTRPCReact<AppRouter>();

function trpcHttpUrl(): string {
  if (import.meta.env.DEV) {
    return '/trpc';
  }
  const base = import.meta.env.VITE_API_URL;
  if (typeof base !== 'string' || base.length === 0) {
    throw new Error('VITE_API_URL is required for production builds');
  }
  return `${base.replace(/\/$/, '')}/trpc`;
}

function createLinks() {
  return [
    httpBatchLink({
      url: trpcHttpUrl(),
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
