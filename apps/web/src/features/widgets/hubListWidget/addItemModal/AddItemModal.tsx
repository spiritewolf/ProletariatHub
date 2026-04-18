import { Box, Dialog, Flex, IconButton, Portal, Text } from '@chakra-ui/react';
import type { HubInventoryProduct } from '@proletariat-hub/types';
import { HubListItemPriority } from '@proletariat-hub/types';
import { ArrowLeft, X } from 'lucide-react';
import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';

import { AddItemNewProductStep } from '../components/AddItemNewProductStep';
import { AddItemSearchStep } from '../components/AddItemSearchStep';

const STEP = {
  SEARCH: 'search',
  NEW_PRODUCT: 'newProduct',
} as const;

type AddItemStep = (typeof STEP)[keyof typeof STEP];

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

  const onOpenChange = useCallback(
    (details: { open: boolean }): void => {
      if (!details.open) {
        onClose();
      }
    },
    [onClose],
  );

  const goBackToSearch = (): void => {
    setStep(STEP.SEARCH);
  };

  const headerTitle = step === STEP.NEW_PRODUCT ? 'New product' : 'Add to hub list';

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
            </Dialog.Header>

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
                  onAddedToList={onClose}
                />
              ) : null}
              {step === STEP.NEW_PRODUCT ? (
                <AddItemNewProductStep
                  initialName={searchQuery}
                  listItemContext={{
                    priority: listPriority,
                    quantity: listQuantity,
                    notes: listNotes,
                  }}
                  onSubmitSuccess={onClose}
                />
              ) : null}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
