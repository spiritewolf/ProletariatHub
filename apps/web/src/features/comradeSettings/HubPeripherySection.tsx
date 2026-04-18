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
import type { Comrade } from '@proletariat-hub/types';
import { ComradeRole } from '@proletariat-hub/types';
import { useFindManyPeriphery } from '@proletariat-hub/web/shared/trpc';
import { Info, Plus } from 'lucide-react';
import { type ReactElement, useState } from 'react';

import { PeripheryAddPanel } from './components/PeripheryAddPanel';
import { PeripheryListItem } from './components/PeripheryListItem';

const PERIPHERY_PAGE_SIZE = 10;

type HubPeripherySectionProps = {
  comrade: Comrade;
};

export function HubPeripherySection({ comrade }: HubPeripherySectionProps): ReactElement {
  const isAdmin = comrade.role === ComradeRole.ADMIN;
  const [openPeripheryId, setOpenPeripheryId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [showAllPeriphery, setShowAllPeriphery] = useState(false);
  const { data: peripheryRecords = [], isLoading } = useFindManyPeriphery({ enabled: isAdmin });

  const total = peripheryRecords.length;
  const displayedList =
    showAllPeriphery || total <= PERIPHERY_PAGE_SIZE
      ? peripheryRecords
      : peripheryRecords.slice(0, PERIPHERY_PAGE_SIZE);
  const onOpenAddPanel = (): void => {
    setOpenPeripheryId(null);
    setIsAddOpen(true);
  };

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

        {isLoading ? <Text textStyle="helperText">Loading…</Text> : null}

        {!isLoading && total === 0 && !isAddOpen ? (
          <Flex align="center" justify="space-between" gap={3} flexWrap="wrap" py={1} px={1}>
            <Text textStyle="helperText" flex="1" minW={0}>
              No periphery yet? Click Add to get started.
            </Text>
            <Button
              type="button"
              variant="outline"
              size="sm"
              shape="pill"
              color="accent.primary"
              borderColor="accent.primary"
              flexShrink={0}
              onClick={onOpenAddPanel}
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
            <PeripheryAddPanel
              onCancel={() => {
                setIsAddOpen(false);
              }}
            />
          ) : null}

          {displayedList.length > 0 ? (
            <Accordion.Root
              collapsible
              lazyMount
              multiple={false}
              unmountOnExit
              value={openPeripheryId ? [openPeripheryId] : []}
              onValueChange={(details) => {
                const [nextOpenId] = details.value;
                setOpenPeripheryId(nextOpenId ?? null);
                setIsAddOpen(false);
              }}
              display="flex"
              flexDirection="column"
              gap={2}
            >
              {displayedList.map((periphery) => (
                <PeripheryListItem
                  key={periphery.id}
                  periphery={periphery}
                  isOpen={openPeripheryId === periphery.id}
                  onToggle={() => {
                    setOpenPeripheryId((current) =>
                      current === periphery.id ? null : periphery.id,
                    );
                  }}
                />
              ))}
            </Accordion.Root>
          ) : null}
        </Stack>

        {total > 0 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            shape="pill"
            alignSelf="flex-start"
            color="accent.primary"
            borderColor="accent.primary"
            onClick={onOpenAddPanel}
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
