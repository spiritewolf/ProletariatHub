import { useCallback } from 'react';

import { trpc } from './trpcClient';

type CreateOnePeripheryMutationOpts = Parameters<
  typeof trpc.periphery.createOnePeriphery.useMutation
>[0];
type UpdateOnePeripheryMutationOpts = Parameters<
  typeof trpc.periphery.updateOnePeriphery.useMutation
>[0];
type ArchiveOnePeripheryMutationOpts = Parameters<
  typeof trpc.periphery.archiveOnePeriphery.useMutation
>[0];

export function useInvalidatePeripheryFindMany(): () => Promise<void> {
  const utils = trpc.useUtils();
  return useCallback(async () => {
    await utils.periphery.findManyPeriphery.invalidate();
  }, [utils]);
}

export function useCreateOnePeriphery(
  opts?: CreateOnePeripheryMutationOpts,
): ReturnType<typeof trpc.periphery.createOnePeriphery.useMutation> {
  const invalidatePeripheryFindMany = useInvalidatePeripheryFindMany();
  return trpc.periphery.createOnePeriphery.useMutation({
    ...opts,
    onSuccess: async (...args) => {
      await invalidatePeripheryFindMany();
      await opts?.onSuccess?.(...args);
    },
  });
}

export function useUpdateOnePeriphery(
  opts?: UpdateOnePeripheryMutationOpts,
): ReturnType<typeof trpc.periphery.updateOnePeriphery.useMutation> {
  const invalidatePeripheryFindMany = useInvalidatePeripheryFindMany();
  return trpc.periphery.updateOnePeriphery.useMutation({
    ...opts,
    onSuccess: async (...args) => {
      await invalidatePeripheryFindMany();
      await opts?.onSuccess?.(...args);
    },
  });
}

export function useArchiveOnePeriphery(
  opts?: ArchiveOnePeripheryMutationOpts,
): ReturnType<typeof trpc.periphery.archiveOnePeriphery.useMutation> {
  const invalidatePeripheryFindMany = useInvalidatePeripheryFindMany();
  return trpc.periphery.archiveOnePeriphery.useMutation({
    ...opts,
    onSuccess: async (...args) => {
      await invalidatePeripheryFindMany();
      await opts?.onSuccess?.(...args);
    },
  });
}
