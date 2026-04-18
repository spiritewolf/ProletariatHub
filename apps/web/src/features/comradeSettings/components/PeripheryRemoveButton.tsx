import { Button, HStack, Stack, Text } from '@chakra-ui/react';
import { useArchiveOnePeriphery } from '@proletariat-hub/web/shared/trpc';
import type { ReactElement } from 'react';

type PeripheryRemoveButtonProps = {
  peripheryId: string;
  onCancel: () => void;
  onRemoved?: () => void;
};

export function PeripheryRemoveButton({
  peripheryId,
  onCancel,
  onRemoved,
}: PeripheryRemoveButtonProps): ReactElement {
  const archiveMutation = useArchiveOnePeriphery({
    onSuccess: async () => {
      onRemoved?.();
    },
  });

  return (
    <Stack gap={3} pt={1}>
      <Text fontSize="sm" color="text.primary">
        Remove this periphery member? This cannot be undone.
      </Text>
      <HStack gap={2} justify="flex-end" flexWrap="wrap">
        <Button type="button" variant="ghost" size="sm" shape="pill" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="solid"
          size="sm"
          shape="pill"
          colorPalette="destructivePalette"
          loading={archiveMutation.isPending}
          onClick={() => {
            archiveMutation.mutate({ id: peripheryId });
          }}
        >
          Remove
        </Button>
      </HStack>
    </Stack>
  );
}
