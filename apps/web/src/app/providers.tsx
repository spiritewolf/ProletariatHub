import { ChakraProvider } from '@chakra-ui/react';
import { system } from '@proletariat-hub/ui';
import { appQueryClient, appTrpcClient, trpc } from '@proletariat-hub/web/shared/lib/trpc';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange>
        <trpc.Provider client={appTrpcClient} queryClient={appQueryClient}>
          <QueryClientProvider client={appQueryClient}>{children}</QueryClientProvider>
        </trpc.Provider>
      </ThemeProvider>
    </ChakraProvider>
  );
}
