import { ChakraProvider } from '@chakra-ui/react';
import { appQueryClient, appTrpcClient, trpc } from '@proletariat-hub/web/shared/trpc';
import { system } from '@proletariat-hub/web/shared/ui';
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
