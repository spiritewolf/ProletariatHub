import { trpc } from '@proletariat-hub/web/shared/lib/trpc';

export type CompleteWizardMutation = ReturnType<typeof trpc.comrade.completeAdminSetup.useMutation>;
