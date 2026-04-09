import { ChakraProvider } from '@chakra-ui/react';
import { system } from '@proletariat-hub/ui';
import { createTRPCClient, trpc } from '@proletariat-hub/web/shared/lib/trpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 1000 * 60, refetchOnWindowFocus: true },
        },
      }),
  );
  const [trpcClient] = useState(() => createTRPCClient());

  return (
    <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider value={system}>{children}</ChakraProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </ThemeProvider>
  );
}
