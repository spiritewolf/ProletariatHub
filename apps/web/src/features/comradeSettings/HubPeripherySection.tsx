import {
  Accordion,
  Box,
  Button,
  Flex,
  HStack,
  Separator,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Comrade } from '@proletariat-hub/types';
import {
  ComradeAvatarIconType,
  ComradeRole,
  HubPeripheryCategory as HubPeripheryCategoryConst,
} from '@proletariat-hub/types';
import { useFindManyPeriphery } from '@proletariat-hub/web/shared/trpc';
import {
  useArchiveOnePeriphery,
  useCreateOnePeriphery,
  useUpdateOnePeriphery,
} from '@proletariat-hub/web/shared/trpc/mutations';
import { toaster } from '@proletariat-hub/web/shared/ui';
import { Info, Plus } from 'lucide-react';
import { type ReactElement, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { PeripheryCategoryBadge } from './components/PeripheryCategoryBadge';
import { PeripheryExpandedFields } from './components/PeripheryExpandedFields';
import { PeripheryGlyph } from './components/PeripheryGlyph';
import type { HubPeripheryDrawerFormValues } from './peripheryFormSchema';
import { hubPeripheryDrawerFormSchema } from './peripheryFormSchema';

const PERIPHERY_PAGE_SIZE = 10;

const PERIPHERY_FORM_DEFAULTS: HubPeripheryDrawerFormValues = {
  name: '',
  peripheryCategory: HubPeripheryCategoryConst.PERSON,
  birthDate: '',
  petAvatarIcon: ComradeAvatarIconType.SNAIL,
};

type HubPeripherySectionProps = {
  comrade: Comrade;
};

export function HubPeripherySection({ comrade }: HubPeripherySectionProps): ReactElement {
  const isAdmin = comrade.role === ComradeRole.ADMIN;

  const [accordionValue, setAccordionValue] = useState<string[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [showAllPeriphery, setShowAllPeriphery] = useState(false);
  const [removeConfirmId, setRemoveConfirmId] = useState<string | null>(null);

  const { data: peripheryRecords = [], isLoading } = useFindManyPeriphery({
    enabled: isAdmin,
  });

  const addForm = useForm<HubPeripheryDrawerFormValues>({
    resolver: zodResolver(hubPeripheryDrawerFormSchema),
    mode: 'onChange',
    defaultValues: PERIPHERY_FORM_DEFAULTS,
  });

  const editForm = useForm<HubPeripheryDrawerFormValues>({
    resolver: zodResolver(hubPeripheryDrawerFormSchema),
    mode: 'onChange',
    defaultValues: PERIPHERY_FORM_DEFAULTS,
  });

  const createMutation = useCreateOnePeriphery({
    onSuccess: async () => {
      setIsAddOpen(false);
      addForm.reset(PERIPHERY_FORM_DEFAULTS);
    },
  });

  const updateMutation = useUpdateOnePeriphery({
    onSuccess: async () => {
      setRemoveConfirmId(null);
    },
  });

  const archiveMutation = useArchiveOnePeriphery({
    onSuccess: async () => {
      setAccordionValue([]);
      setRemoveConfirmId(null);
    },
  });

  const total = peripheryRecords.length;
  const displayedList =
    showAllPeriphery || total <= PERIPHERY_PAGE_SIZE
      ? peripheryRecords
      : peripheryRecords.slice(0, PERIPHERY_PAGE_SIZE);

  const openPeripheryId = accordionValue[0];

  useEffect(() => {
    if (openPeripheryId === undefined) {
      return;
    }
    const selectedPeripheryRecord = peripheryRecords.find((p) => p.id === openPeripheryId);
    if (selectedPeripheryRecord === undefined) {
      return;
    }
    const editValues: HubPeripheryDrawerFormValues = {
      name: selectedPeripheryRecord.name,
      peripheryCategory: selectedPeripheryRecord.peripheryCategory,
      birthDate: selectedPeripheryRecord.settings.birthDate
        ? selectedPeripheryRecord.settings.birthDate.toISOString().slice(0, 10)
        : '',
      petAvatarIcon:
        selectedPeripheryRecord.peripheryCategory === HubPeripheryCategoryConst.PET &&
        selectedPeripheryRecord.settings.avatarIcon
          ? selectedPeripheryRecord.settings.avatarIcon
          : ComradeAvatarIconType.SNAIL,
    };
    editForm.reset(editValues);
  }, [openPeripheryId, peripheryRecords, editForm]);

  const onOpenAdd = (): void => {
    setAccordionValue([]);
    setRemoveConfirmId(null);
    setIsAddOpen(true);
    addForm.reset(PERIPHERY_FORM_DEFAULTS);
  };

  const onCancelAdd = (): void => {
    setIsAddOpen(false);
    addForm.reset(PERIPHERY_FORM_DEFAULTS);
  };

  const onSubmitAdd = async (values: HubPeripheryDrawerFormValues): Promise<void> => {
    const avatarIcon: string | null =
      values.peripheryCategory === HubPeripheryCategoryConst.PET ? values.petAvatarIcon : null;
    createMutation.mutate(
      {
        name: values.name,
        peripheryCategory: values.peripheryCategory,
        birthDate: values.birthDate || null,
        avatarIcon,
      },
      {
        onSuccess: () => {
          toaster.create({
            type: 'success',
            title: 'Periphery added',
            description: 'The periphery member has been added to your Hub.',
          });
        },
      },
    );
  };

  const onSubmitEdit = (values: HubPeripheryDrawerFormValues): void => {
    if (openPeripheryId === undefined) {
      return;
    }
    const avatarIcon: string | null =
      values.peripheryCategory === HubPeripheryCategoryConst.PET ? values.petAvatarIcon : null;
    updateMutation.mutate({
      id: openPeripheryId,
      name: values.name,
      peripheryCategory: values.peripheryCategory,
      birthDate: values.birthDate || null,
      avatarIcon,
    });
  };

  const onCancelEdit = (): void => {
    setAccordionValue([]);
    setRemoveConfirmId(null);
  };

  const addFormId = 'hub-periphery-add-form';
  const editFormId = 'hub-periphery-edit-form';

  return (
    <>
      <Separator borderColor="border.secondary" />

      <Stack gap={3} align="stretch">
        <HStack gap={2} align="center">
          <Text
            fontSize="xs"
            fontWeight="semibold"
            letterSpacing="0.12em"
            color="accent.primary"
            textTransform="uppercase"
          >
            Periphery
          </Text>
          <Tooltip.Root openDelay={200}>
            <Tooltip.Trigger asChild>
              <Box
                as="span"
                display="inline-flex"
                alignItems="center"
                color="accent.primary"
                cursor="default"
                lineHeight={0}
                aria-label="About periphery"
              >
                <Info size={14} aria-hidden />
              </Box>
            </Tooltip.Trigger>
            <Tooltip.Positioner>
              <Tooltip.Content maxW="260px" fontSize="xs" px={3} py={2}>
                Those in your Hub who aren&apos;t app users (kids, family members, pets, etc.)
              </Tooltip.Content>
            </Tooltip.Positioner>
          </Tooltip.Root>
        </HStack>

        {isLoading ? (
          <Text fontSize="sm" color="text.secondary">
            Loading…
          </Text>
        ) : null}

        {!isLoading && total === 0 && !isAddOpen ? (
          <Flex align="center" justify="space-between" gap={3} flexWrap="wrap" py={1} px={1}>
            <Text fontSize="sm" color="text.secondary" flex="1" minW={0}>
              No periphery yet? Click Add to get started.
            </Text>
            <Button
              type="button"
              variant="outline"
              size="sm"
              borderRadius="full"
              color="accent.primary"
              borderColor="accent.primary"
              flexShrink={0}
              onClick={onOpenAdd}
            >
              <HStack gap={1}>
                <Plus size={16} aria-hidden />
                <Text as="span">Add</Text>
              </HStack>
            </Button>
          </Flex>
        ) : null}

        <Stack gap={2} align="stretch">
          {isAddOpen ? (
            <Box borderWidth="1px" borderColor="border.primary" borderRadius="md" overflow="hidden">
              <Box px={3} py={2} bg="bg.secondary">
                <Text fontSize="sm" fontWeight="semibold" color="text.primary">
                  New periphery
                </Text>
              </Box>
              <FormProvider {...addForm}>
                <form
                  id={addFormId}
                  onSubmit={(e) => {
                    e.preventDefault();
                    void addForm.handleSubmit(onSubmitAdd)(e);
                  }}
                >
                  <PeripheryExpandedFields
                    formId={addFormId}
                    onCancel={onCancelAdd}
                    isSaveDisabled={!addForm.formState.isDirty || createMutation.isPending}
                    isSaveLoading={createMutation.isPending}
                  />
                </form>
              </FormProvider>
            </Box>
          ) : null}

          {displayedList.length > 0 ? (
            <Accordion.Root
              collapsible
              lazyMount
              multiple={false}
              unmountOnExit
              value={accordionValue}
              onValueChange={(details) => {
                setAccordionValue(details.value);
                setIsAddOpen(false);
                setRemoveConfirmId(null);
              }}
              display="flex"
              flexDirection="column"
              gap={2}
            >
              {displayedList.map((p) => (
                <Accordion.Item
                  key={p.id}
                  value={p.id}
                  borderWidth="1px"
                  borderColor="border.primary"
                  borderRadius="md"
                  overflow="hidden"
                >
                  <Accordion.ItemTrigger
                    cursor="pointer"
                    w="100%"
                    py={2.5}
                    px={3}
                    display="flex"
                    alignItems="center"
                    gap={3}
                    borderRadius="0"
                    fontWeight="normal"
                    color="inherit"
                    bg="transparent"
                    _hover={{ bg: 'bg.secondary' }}
                    _open={{ bg: 'bg.secondary' }}
                  >
                    <HStack gap={3} align="center" flex="1" minW={0}>
                      <PeripheryGlyph
                        category={p.peripheryCategory}
                        avatarIcon={p.settings.avatarIcon}
                      />
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color="text.primary"
                        flex="1"
                        minW={0}
                        truncate
                      >
                        {p.name}
                      </Text>
                      <PeripheryCategoryBadge category={p.peripheryCategory} />
                    </HStack>
                    <Accordion.ItemIndicator color="text.tertiary" />
                  </Accordion.ItemTrigger>
                  <Accordion.ItemContent>
                    <Accordion.ItemBody px={0} pt={0} pb={0}>
                      <FormProvider {...editForm}>
                        <form
                          id={editFormId}
                          onSubmit={(e) => {
                            e.preventDefault();
                            void editForm.handleSubmit(onSubmitEdit)(e);
                          }}
                        >
                          <PeripheryExpandedFields
                            formId={editFormId}
                            onCancel={onCancelEdit}
                            isSaveDisabled={!editForm.formState.isDirty || updateMutation.isPending}
                            isSaveLoading={updateMutation.isPending}
                            onRemoveClick={() => {
                              setRemoveConfirmId(p.id);
                            }}
                            removeConfirmContent={
                              removeConfirmId === p.id ? (
                                <Stack gap={3} pt={1}>
                                  <Text fontSize="sm" color="text.primary">
                                    Remove this periphery member? This cannot be undone.
                                  </Text>
                                  <HStack gap={2} justify="flex-end" flexWrap="wrap">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      borderRadius="full"
                                      onClick={() => {
                                        setRemoveConfirmId(null);
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="solid"
                                      size="sm"
                                      borderRadius="full"
                                      bg="status.error"
                                      color="text.light"
                                      loading={archiveMutation.isPending}
                                      onClick={() => {
                                        archiveMutation.mutate({ id: p.id });
                                      }}
                                    >
                                      Remove
                                    </Button>
                                  </HStack>
                                </Stack>
                              ) : null
                            }
                          />
                        </form>
                      </FormProvider>
                    </Accordion.ItemBody>
                  </Accordion.ItemContent>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          ) : null}
        </Stack>

        {total > 0 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            borderRadius="full"
            alignSelf="flex-start"
            color="accent.primary"
            borderColor="accent.primary"
            onClick={onOpenAdd}
          >
            <HStack gap={1}>
              <Plus size={16} aria-hidden />
              <Text as="span">Add</Text>
            </HStack>
          </Button>
        ) : null}

        {total > PERIPHERY_PAGE_SIZE && !showAllPeriphery ? (
          <Stack gap={1} align="stretch">
            <Text fontSize="xs" color="text.secondary">
              Showing {PERIPHERY_PAGE_SIZE} of {total}
            </Text>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              color="accent.primary"
              fontWeight="semibold"
              alignSelf="flex-start"
              px={0}
              onClick={() => {
                setShowAllPeriphery(true);
              }}
            >
              Show all
            </Button>
          </Stack>
        ) : null}
      </Stack>
    </>
  );
}
