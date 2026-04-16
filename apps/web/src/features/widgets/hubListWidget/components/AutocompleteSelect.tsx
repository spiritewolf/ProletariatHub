import { Box, Button, IconButton, Input, Stack, Text } from '@chakra-ui/react';
import { Search, X } from 'lucide-react';
import type { ReactElement } from 'react';
import { useMemo, useState } from 'react';

export type AutocompleteSelectItem = { id: string; name: string };

export type AutocompleteSelectProps = {
  label: string;
  items: AutocompleteSelectItem[];
  selectedItem: AutocompleteSelectItem | null;
  onSelect: (item: AutocompleteSelectItem) => void;
  onClear: () => void;
  placeholder: string;
  onSearchChange?: (value: string) => void;
};

export function AutocompleteSelect({
  label,
  items,
  selectedItem,
  onSelect,
  onClear,
  placeholder,
  onSearchChange,
}: AutocompleteSelectProps): ReactElement {
  const [searchText, setSearchText] = useState('');

  const filteredItems = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (query.length === 0) {
      return items;
    }
    return items.filter((item) => item.name.toLowerCase().includes(query));
  }, [items, searchText]);

  const showDropdown = selectedItem === null && searchText.trim().length > 0 && filteredItems.length > 0;

  return (
    <Box position="relative" w="full">
      <Text fontSize="xs" fontWeight="medium" color="text.primary" mb="1.5">
        {label}
      </Text>
      {selectedItem !== null ? (
        <Box
          display="flex"
          alignItems="center"
          gap="2"
          borderRadius="full"
          borderWidth="1px"
          borderColor="success.fg"
          bg="success.subtle"
          px="3.5"
          py="2"
          minH="10"
        >
          <Text fontSize="sm" fontWeight="medium" color="text.primary" flex="1" lineClamp={1}>
            {selectedItem.name}
          </Text>
          <IconButton
            type="button"
            aria-label={`Clear ${label}`}
            variant="ghost"
            size="xs"
            flexShrink={0}
            colorPalette="gray"
            onClick={() => {
              onClear();
              setSearchText('');
            }}
          >
            <X size={16} strokeWidth={2} />
          </IconButton>
        </Box>
      ) : (
        <>
          <Box position="relative" w="full">
            <Box
              position="absolute"
              left="3.5"
              top="50%"
              transform="translateY(-50%)"
              color="text.secondary"
              pointerEvents="none"
              lineHeight={0}
              zIndex={1}
              aria-hidden
            >
              <Search size={18} strokeWidth={2} />
            </Box>
            <Input
              value={searchText}
              onChange={(event) => {
                const next = event.target.value;
                setSearchText(next);
                onSearchChange?.(next);
              }}
              placeholder={placeholder}
              variant="outline"
              borderRadius="full"
              py="2"
              pl="10"
              pr="3.5"
              fontSize="sm"
              borderColor="border.primary"
              bg="bg.primary"
            />
          </Box>
          {showDropdown ? (
            <Stack
              position="absolute"
              left="0"
              right="0"
              top="calc(100% + 4px)"
              zIndex={10}
              gap="0"
              maxH="40"
              overflowY="auto"
              borderWidth="1px"
              borderColor="border.primary"
              borderRadius="md"
              bg="bg.primary"
              boxShadow="md"
            >
              {filteredItems.map((item) => (
                <Button
                  key={item.id}
                  type="button"
                  variant="ghost"
                  w="full"
                  justifyContent="flex-start"
                  px="3"
                  py="2"
                  h="auto"
                  minH="10"
                  fontSize="sm"
                  fontWeight="normal"
                  rounded="none"
                  colorPalette="gray"
                  _hover={{ bg: 'bg.secondary' }}
                  onClick={() => {
                    onSelect(item);
                    setSearchText('');
                    onSearchChange?.('');
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Stack>
          ) : null}
        </>
      )}
    </Box>
  );
}
