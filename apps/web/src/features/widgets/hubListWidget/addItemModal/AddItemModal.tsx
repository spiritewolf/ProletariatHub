import { Box, Dialog, Flex, IconButton, Portal, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { HubListItemPriority } from '@proletariat-hub/types';
import { useCreateOneListItem } from '@proletariat-hub/web/shared/trpc';
import { toaster } from '@proletariat-hub/web/shared/ui';
import { ArrowLeft, X } from 'lucide-react';
import type { ReactElement } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { AddItemNewProductStep } from './AddItemNewProductStep';
import { AddListItemStep } from './AddListItemStep';

const LIST_ITEM_STEPS = {
  ADD_LIST_ITEM: 'ADD_LIST_ITEM',
  ADD_INVENTORY_PRODUCT: 'ADD_INVENTORY_PRODUCT',
} as const;

type AddItemStep = (typeof LIST_ITEM_STEPS)[keyof typeof LIST_ITEM_STEPS];

type AddItemModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const addItemFormSchema = z.object({
  productId: z.string(),
  priority: z.nativeEnum(HubListItemPriority).optional(),
  quantity: z.number().min(1),
  notes: z.string().optional(),
});

export type AddHubListItemFormValues = z.infer<typeof addItemFormSchema>;

export function AddItemModal({ isOpen, onClose }: AddItemModalProps): ReactElement {
  const [step, setStep] = useState<AddItemStep>(LIST_ITEM_STEPS.ADD_LIST_ITEM);
  const [listItemText, setListItemText] = useState<string | null>(null);

  const listItemFormMethods = useForm<AddHubListItemFormValues>({
    defaultValues: {
      quantity: 1,
    },
    resolver: zodResolver(addItemFormSchema),
  });

  useEffect(() => {
    listItemFormMethods.reset({
      quantity: 1,
    });
  }, [listItemFormMethods, isOpen]);

  const createListItem = useCreateOneListItem({
    onSuccess: () => {
      toaster.create({
        type: 'success',
        title: 'Item has been added to your hub list!',
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

  const onOpenChange = useCallback(
    (details: { open: boolean }): void => {
      if (!details.open) {
        onClose();
      }
    },
    [onClose],
  );

  const goBackToSearch = (): void => {
    setStep(LIST_ITEM_STEPS.ADD_LIST_ITEM);
  };

  const headerTitle =
    step === LIST_ITEM_STEPS.ADD_INVENTORY_PRODUCT ? 'Create New Product' : 'Add List Item';

  const onSubmit = (values: AddHubListItemFormValues): void => {
    createListItem.mutate({
      productId: values.productId,
      priority: values.priority,
      quantity: values.quantity,
      notes: values.notes,
    });
  };

  const onAddNewProduct = (productName: string): void => {
    setListItemText(productName);
    setStep(LIST_ITEM_STEPS.ADD_INVENTORY_PRODUCT);
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      scrollBehavior="inside"
      unmountOnExit
      lazyMount
    >
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.600" />
        <Dialog.Positioner px="4" py="8">
          <Dialog.Content
            maxW="lg"
            w="full"
            bg="bg.primary"
            color="text.primary"
            borderRadius="l2"
            borderWidth="1px"
            borderColor="border.primary"
            overflow="hidden"
            display="flex"
            flexDirection="column"
            maxH="600px"
          >
            <Dialog.Header
              flexShrink={0}
              bg="topbar.primary"
              color="text.light"
              px={{ base: 4, md: 5 }}
              pt={4}
              pb={3}
            >
              <Flex align="center" gap={2} minH="10">
                {step === LIST_ITEM_STEPS.ADD_LIST_ITEM ? (
                  <Box w="10" flexShrink={0} aria-hidden />
                ) : (
                  <IconButton
                    type="button"
                    aria-label="Back to search"
                    variant="ghost"
                    size="sm"
                    color="text.light"
                    opacity={0.9}
                    minW="10"
                    px={2}
                    _hover={{ opacity: 1, bg: 'whiteAlpha.200' }}
                    onClick={goBackToSearch}
                  >
                    <ArrowLeft size={20} aria-hidden />
                  </IconButton>
                )}
                <Dialog.Title asChild>
                  <Text flex="1" fontSize="md" fontWeight="medium" lineHeight="short">
                    {headerTitle}
                  </Text>
                </Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <IconButton
                    type="button"
                    aria-label="Close"
                    variant="ghost"
                    size="sm"
                    color="text.light"
                    opacity={0.75}
                    minW="10"
                    px={2}
                    _hover={{ opacity: 1, bg: 'whiteAlpha.200' }}
                  >
                    <X size={18} aria-hidden />
                  </IconButton>
                </Dialog.CloseTrigger>
              </Flex>
            </Dialog.Header>

            <Dialog.Body flex="1" minH={0} overflowY="auto" px={{ base: 4, md: 5 }} py={5}>
              {step === LIST_ITEM_STEPS.ADD_LIST_ITEM ? (
                <FormProvider {...listItemFormMethods}>
                  <form onSubmit={listItemFormMethods.handleSubmit(onSubmit)}>
                    <AddListItemStep onCreateNew={onAddNewProduct} />
                  </form>
                </FormProvider>
              ) : null}
              {step === LIST_ITEM_STEPS.ADD_INVENTORY_PRODUCT ? (
                <AddItemNewProductStep
                  initialName={listItemText ?? ''}
                  onSubmitSuccess={() => setStep(LIST_ITEM_STEPS.ADD_LIST_ITEM)}
                />
              ) : null}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
