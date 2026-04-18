import { Button, Dialog, Text } from '@chakra-ui/react';
import type { HubListItem } from '@proletariat-hub/types';
import { useRemoveOneListItem } from '@proletariat-hub/web/shared/trpc';
import { toaster } from '@proletariat-hub/web/shared/ui';
import type { ReactElement } from 'react';

type RemoveListItemDialogProps = {
  hubListId: string;
  hubListItem: HubListItem;
  onClose: () => void;
  isOpen: boolean;
};

export function RemoveListItemDialog({
  hubListId,
  onClose,
  hubListItem,
  isOpen,
}: RemoveListItemDialogProps): ReactElement {
  const removeListItemMutation = useRemoveOneListItem({
    onSuccess: () => {
      toaster.create({
        type: 'success',
        title: 'Removed from list',
      });
      onClose();
    },
    onError: (error) => {
      toaster.create({
        type: 'error',
        title: error.message,
      });
    },
  });

  const onRemoveListItem = async (): Promise<void> => {
    await removeListItemMutation.mutateAsync({ hubListItemId: hubListItem.id, hubListId });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose} role="alertdialog">
      <Dialog.Backdrop bg="blackAlpha.600" />
      <Dialog.Positioner>
        <Dialog.Content
          maxW="sm"
          bg="bg.primary"
          borderRadius="l2"
          borderWidth="1px"
          borderColor="border.primary"
        >
          <Dialog.Header>
            <Dialog.Title>Remove from list?</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Text textStyle="helperText">
              Remove {hubListItem?.productName ?? 'this item'} from the hub list?
            </Text>
          </Dialog.Body>
          <Dialog.Footer gap="2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              colorPalette="destructivePalette"
              loading={removeListItemMutation.isPending}
              onClick={onRemoveListItem}
            >
              Remove
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
