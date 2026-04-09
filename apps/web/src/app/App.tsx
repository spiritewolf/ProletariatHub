import { Providers } from '@proletariat-hub/web/app/providers';
import { AppRouter } from '@proletariat-hub/web/app/router';

export function App() {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  );
}
