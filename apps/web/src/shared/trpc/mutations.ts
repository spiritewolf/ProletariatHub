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

type CreateOneProductMutationOpts = Parameters<
  typeof trpc.hubInventory.createOneProduct.useMutation
>[0];
type CreateOneListItemMutationOpts = Parameters<
  typeof trpc.hubList.createOneListItem.useMutation
>[0];
type CreateOneVendorMutationOpts = Parameters<
  typeof trpc.hubInventory.createOneVendor.useMutation
>[0];
type RemoveOneListItemMutationOpts = Parameters<
  typeof trpc.hubList.removeOneListItem.useMutation
>[0];
type ClaimOneListItemMutationOpts = Parameters<typeof trpc.hubList.claimOneListItem.useMutation>[0];
type ClaimManyListItemsMutationOpts = Parameters<
  typeof trpc.hubList.claimManyListItems.useMutation
>[0];
type UnclaimOneListItemMutationOpts = Parameters<
  typeof trpc.hubList.unclaimOneListItem.useMutation
>[0];
type UnclaimManyListItemsMutationOpts = Parameters<
  typeof trpc.hubList.unclaimManyListItems.useMutation
>[0];

export function useInvalidateHubList(): () => Promise<void> {
  const utils = trpc.useUtils();
  return useCallback(async () => {
    await utils.hubList.findUniqueHubList.invalidate();
  }, [utils]);
}

export function useInvalidateHubInventoryVendors(): () => Promise<void> {
  const utils = trpc.useUtils();
  return useCallback(async () => {
    await utils.hubInventory.findManyVendors.invalidate();
  }, [utils]);
}

export function useCreateOneProduct(
  opts?: CreateOneProductMutationOpts,
): ReturnType<typeof trpc.hubInventory.createOneProduct.useMutation> {
  const invalidateHubList = useInvalidateHubList();
  return trpc.hubInventory.createOneProduct.useMutation({
    ...opts,
    onSuccess: async (...args) => {
      await invalidateHubList();
      await opts?.onSuccess?.(...args);
    },
  });
}

export function useCreateOneListItem(
  opts?: CreateOneListItemMutationOpts,
): ReturnType<typeof trpc.hubList.createOneListItem.useMutation> {
  const invalidateHubList = useInvalidateHubList();
  return trpc.hubList.createOneListItem.useMutation({
    ...opts,
    onSuccess: async (...args) => {
      await invalidateHubList();
      await opts?.onSuccess?.(...args);
    },
  });
}

export function useCreateOneVendor(
  opts?: CreateOneVendorMutationOpts,
): ReturnType<typeof trpc.hubInventory.createOneVendor.useMutation> {
  const invalidateVendors = useInvalidateHubInventoryVendors();
  return trpc.hubInventory.createOneVendor.useMutation({
    ...opts,
    onSuccess: async (...args) => {
      await invalidateVendors();
      await opts?.onSuccess?.(...args);
    },
  });
}

export function useRemoveOneListItem(
  opts?: RemoveOneListItemMutationOpts,
): ReturnType<typeof trpc.hubList.removeOneListItem.useMutation> {
  const invalidateHubList = useInvalidateHubList();
  return trpc.hubList.removeOneListItem.useMutation({
    ...opts,
    onSuccess: async (...args) => {
      await invalidateHubList();
      await opts?.onSuccess?.(...args);
    },
  });
}

export function useClaimOneListItem(
  opts?: ClaimOneListItemMutationOpts,
): ReturnType<typeof trpc.hubList.claimOneListItem.useMutation> {
  const invalidateHubList = useInvalidateHubList();
  return trpc.hubList.claimOneListItem.useMutation({
    ...opts,
    onSuccess: async (...args) => {
      await invalidateHubList();
      await opts?.onSuccess?.(...args);
    },
  });
}

export function useClaimManyListItems(
  opts?: ClaimManyListItemsMutationOpts,
): ReturnType<typeof trpc.hubList.claimManyListItems.useMutation> {
  const invalidateHubList = useInvalidateHubList();
  return trpc.hubList.claimManyListItems.useMutation({
    ...opts,
    onSuccess: async (...args) => {
      await invalidateHubList();
      await opts?.onSuccess?.(...args);
    },
  });
}

export function useUnclaimOneListItem(
  opts?: UnclaimOneListItemMutationOpts,
): ReturnType<typeof trpc.hubList.unclaimOneListItem.useMutation> {
  const invalidateHubList = useInvalidateHubList();
  return trpc.hubList.unclaimOneListItem.useMutation({
    ...opts,
    onSuccess: async (...args) => {
      await invalidateHubList();
      await opts?.onSuccess?.(...args);
    },
  });
}

export function useUnclaimManyListItems(
  opts?: UnclaimManyListItemsMutationOpts,
): ReturnType<typeof trpc.hubList.unclaimManyListItems.useMutation> {
  const invalidateHubList = useInvalidateHubList();
  return trpc.hubList.unclaimManyListItems.useMutation({
    ...opts,
    onSuccess: async (...args) => {
      await invalidateHubList();
      await opts?.onSuccess?.(...args);
    },
  });
}
