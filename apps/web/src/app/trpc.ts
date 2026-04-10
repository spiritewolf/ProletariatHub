import type { AppRouter } from '@proletariat-hub/api/router';
import { httpBatchLink } from '@trpc/client';
import { type CreateTRPCReact, createTRPCReact } from '@trpc/react-query';
import superjson from 'superjson';

export const trpc: CreateTRPCReact<AppRouter, unknown> = createTRPCReact<AppRouter>();

export function createTRPCClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: `${import.meta.env.VITE_API_URL}/trpc`,
        fetch(url, options) {
          return fetch(url, { ...options, credentials: 'include' });
        },
        transformer: superjson,
      }),
    ],
  });
}
