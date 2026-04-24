import { Box, Button, Checkbox, Flex, HStack, Text } from '@chakra-ui/react';
import { HubListItem } from '@proletariat-hub/types';
import { Plus } from 'lucide-react';
import type { ReactElement } from 'react';

type CheckboxCheckedState = boolean | 'indeterminate';

type HubListWidgetHeaderProps = {
  selectedItemIds: Set<string>;
  activeListItems: HubListItem[];
  onAddListItem: () => void;
  onClaimSelected: () => void;
  isClaimPending: boolean;
  onToggleSelectAll: () => void;
};

export function HubListWidgetHeader({
  onAddListItem,
  onClaimSelected,
  isClaimPending,
  selectedItemIds,
  onToggleSelectAll,
  activeListItems,
}: HubListWidgetHeaderProps): ReactElement {
  const isAllActiveSelected =
    activeListItems.length > 0 && activeListItems.every((item) => selectedItemIds.has(item.id));
  const hasSomeSelection = selectedItemIds.size > 0 && !isAllActiveSelected;
  const isIndeterminate = !isAllActiveSelected && hasSomeSelection;
  const selectAllChecked: CheckboxCheckedState =
    isAllActiveSelected || (isIndeterminate ? 'indeterminate' : false);

  return (
    <Flex
      align="center"
      justify="space-between"
      gap="3"
      flexShrink={0}
      pb="3"
      borderBottomWidth="1px"
      borderColor="hubList.border"
    >
      <HStack gap="3" minW="0" flex="1">
        <Box flexShrink={0} display="flex" alignItems="center">
          <Checkbox.Root
            size="sm"
            variant="outline"
            colorPalette="brandPalette"
            checked={selectAllChecked}
            disabled={!activeListItems.length}
            onCheckedChange={() => {
              if (activeListItems.length > 0) {
                onToggleSelectAll();
              }
            }}
            aria-label="Select all active hub list items"
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
          </Checkbox.Root>
        </Box>
        <Text color="text.primary" fontWeight="medium" fontSize="md" lineClamp={1}>
          Hub List
        </Text>
        <Text textStyle="helperText" flexShrink={0}>
          {activeListItems.length} active
        </Text>
        {selectedItemIds.size > 0 ? (
          <Button
            type="button"
            colorPalette="brandPalette"
            variant="solid"
            size="xs"
            flexShrink={0}
            onClick={onClaimSelected}
            loading={isClaimPending}
          >
            Claim {selectedItemIds.size} Item(s)
          </Button>
        ) : null}
      </HStack>
      <HStack gap="2" flexShrink={0}>
        <Button variant="ghost" size="sm" color="accent.primary" onClick={onAddListItem}>
          <HStack gap="1">
            <Plus size={16} strokeWidth={2} aria-hidden />
            <Text>Add</Text>
          </HStack>
        </Button>
        <Button variant="ghost" size="sm" color="accent.primary">
          View all
        </Button>
      </HStack>
    </Flex>
  );
}
