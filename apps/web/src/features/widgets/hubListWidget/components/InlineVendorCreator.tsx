import { Box, Button, HStack, Input, Separator, Text } from '@chakra-ui/react';
import { useCreateOneVendor } from '@proletariat-hub/web/shared/trpc';
import { toaster } from '@proletariat-hub/web/shared/ui';
import { Plus } from 'lucide-react';
import type { ReactElement } from 'react';

import { PILL_INPUT_PROPS } from '../constants';

export type InlineVendorCreatorProps = {
  visible: boolean;
  draftName: string;
  onDraftNameChange: (name: string) => void;
  onVendorCreated: (vendorId: string) => void;
};

export function InlineVendorCreator({
  visible,
  draftName,
  onDraftNameChange,
  onVendorCreated,
}: InlineVendorCreatorProps): ReactElement | null {
  const createOneVendor = useCreateOneVendor({
    onSuccess: (vendor) => {
      onVendorCreated(vendor.id);
      toaster.create({
        type: 'success',
        title: 'Vendor created',
      });
    },
    onError: (error) => {
      toaster.create({
        type: 'error',
        title: error.message,
      });
    },
  });

  if (!visible) {
    return null;
  }

  return (
    <>
      <Separator borderColor="border.primary" />
      <Box>
        <HStack gap="2" align="center" mb="1">
          <Plus size={18} strokeWidth={2} color="var(--chakra-colors-accent-primary)" aria-hidden />
          <Text fontSize="sm" fontWeight="medium" color="accent.primary">
            Add new vendor
          </Text>
        </HStack>
        <Text fontSize="xs" color="text.secondary" mb="3">
          Not listed? Save a new vendor to your hub.
        </Text>
        <HStack gap="2" align="stretch">
          <Input
            {...PILL_INPUT_PROPS}
            flex="1"
            placeholder="Vendor name"
            value={draftName}
            onChange={(event) => {
              onDraftNameChange(event.target.value);
            }}
          />
          <Button
            type="button"
            size="md"
            borderRadius="full"
            variant="outline"
            borderColor="border.primary"
            flexShrink={0}
            loading={createOneVendor.isPending}
            disabled={draftName.trim().length === 0}
            onClick={() => {
              createOneVendor.mutate({
                name: draftName,
              });
            }}
          >
            Save
          </Button>
        </HStack>
      </Box>
      <Separator borderColor="border.primary" />
    </>
  );
}
