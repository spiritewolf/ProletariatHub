import { trpc } from '@proletariat-hub/web/shared/trpc';

export type CompleteWizardMutation = ReturnType<typeof trpc.comrade.completeAdminSetup.useMutation>;
