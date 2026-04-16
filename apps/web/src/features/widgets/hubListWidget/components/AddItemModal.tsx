import { Box, Dialog, Flex, IconButton, Text } from '@chakra-ui/react';
import type { HubInventoryProduct } from '@proletariat-hub/types';
import { HubListItemPriority } from '@proletariat-hub/types';
import { ArrowLeft, X } from 'lucide-react';
import type { ReactElement } from 'react';
import { useCallback, useLayoutEffect, useState } from 'react';

import { AddItemNewProductStep } from './AddItemNewProductStep';
import { AddItemSearchStep } from './AddItemSearchStep';

const STEP = {
  SEARCH: 'search',
  NEW_PRODUCT: 'newProduct',
} as const;

type AddItemStep = (typeof STEP)[keyof typeof STEP];

function restoreDocumentInteractionAfterOverlayClose(): void {
  if (typeof document === 'undefined') {
    return;
  }
  const html = document.documentElement;
  const body = document.body;
  const styleProps = ['overflow', 'padding-right', 'pointer-events'] as const;
  for (const el of [body, html]) {
    for (const prop of styleProps) {
      el.style.removeProperty(prop);
    }
  }
  body.removeAttribute('data-scroll-locked');
  html.removeAttribute('data-scroll-locked');
}

type AddItemModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AddItemModal({ isOpen, onClose }: AddItemModalProps): ReactElement {
  const [step, setStep] = useState<AddItemStep>(STEP.SEARCH);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<HubInventoryProduct | null>(null);
  const [listQuantity, setListQuantity] = useState(1);
  const [listPriority, setListPriority] = useState<
    (typeof HubListItemPriority)[keyof typeof HubListItemPriority]
  >(HubListItemPriority.MEDIUM);
  const [listNotes, setListNotes] = useState<string | null>(null);

  const scheduleRestoreDocumentInteraction = useCallback((): void => {
    queueMicrotask(() => {
      restoreDocumentInteractionAfterOverlayClose();
    });
  }, []);

  const finishAndClose = useCallback((): void => {
    onClose();
    scheduleRestoreDocumentInteraction();
  }, [onClose, scheduleRestoreDocumentInteraction]);

  const onOpenChange = useCallback(
    (details: { open: boolean }): void => {
      if (!details.open) {
        onClose();
        scheduleRestoreDocumentInteraction();
      }
    },
    [onClose, scheduleRestoreDocumentInteraction],
  );

  useLayoutEffect(() => {
    if (!isOpen) {
      restoreDocumentInteractionAfterOverlayClose();
    }
  }, [isOpen]);

  useLayoutEffect(() => {
    return () => {
      restoreDocumentInteractionAfterOverlayClose();
    };
  }, []);

  const goBackToSearch = useCallback((): void => {
    setStep(STEP.SEARCH);
  }, []);

  const headerTitle = step === STEP.NEW_PRODUCT ? 'New product' : 'Add to hub list';

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      scrollBehavior="inside"
      preventScroll={false}
      unmountOnExit
      lazyMount
    >
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
          <Box
            flexShrink={0}
            bg="topbar.primary"
            color="text.light"
            px={{ base: 4, md: 5 }}
            pt={4}
            pb={3}
          >
            <Flex align="center" gap={2} minH="10">
              {step === STEP.SEARCH ? (
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
          </Box>

          <Dialog.Body flex="1" minH={0} overflowY="auto" px={{ base: 4, md: 5 }} py={5}>
            {step === STEP.SEARCH ? (
              <AddItemSearchStep
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                listQuantity={listQuantity}
                onListQuantityChange={setListQuantity}
                listPriority={listPriority}
                onListPriorityChange={setListPriority}
                listNotes={listNotes}
                onListNotesChange={setListNotes}
                selectedProduct={selectedProduct}
                onSelectProduct={(product) => {
                  setSelectedProduct(product);
                }}
                onClearSelectedProduct={() => {
                  setSelectedProduct(null);
                }}
                onCreateNew={() => {
                  setStep(STEP.NEW_PRODUCT);
                }}
                onAddedToList={finishAndClose}
              />
            ) : null}
            {step === STEP.NEW_PRODUCT ? (
              <AddItemNewProductStep
                key={searchQuery}
                initialName={searchQuery}
                listItemContext={{
                  priority: listPriority,
                  quantity: listQuantity,
                  notes: listNotes,
                }}
                onSubmitSuccess={finishAndClose}
              />
            ) : null}
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
