import { Combobox, InputGroup, Text, useListCollection } from '@chakra-ui/react';
import { useSearchState } from '@proletariat-hub/web/shared/hooks';
import { useFindManyVendors } from '@proletariat-hub/web/shared/trpc';
import { Search } from 'lucide-react';
import type { ReactElement } from 'react';
import { useEffect, useMemo, useState } from 'react';

export type VendorAutocompleteItem = { id: string; name: string };

type VendorAutocompleteProps = {
  label: string;
  value: string | null;
  onChange: (itemId: string | null) => void;
  onNoResults: (searchText: string) => void;
  placeholder: string;
};

const MIN_CHARS_FOR_NO_RESULTS = 2;

export function VendorAutocomplete({
  label,
  value,
  onChange,
  onNoResults,
  placeholder,
}: VendorAutocompleteProps): ReactElement {
  const { searchText, setSearchText, searchTextDebounced } = useSearchState();
  const vendorSearchText = searchTextDebounced.length >= 2 ? searchTextDebounced : undefined;

  const { data: vendors = [], isFetching } = useFindManyVendors({ searchText: vendorSearchText });

  const [selectedVendor, setSelectedVendor] = useState<VendorAutocompleteItem | null>(null);

  const vendorItems = useMemo((): VendorAutocompleteItem[] => {
    if (!selectedVendor) {
      return vendors;
    }
    if (vendors.some((vendor) => vendor.id === selectedVendor.id)) {
      return vendors;
    }
    return [selectedVendor, ...vendors];
  }, [vendors, selectedVendor]);

  const visibleItems = useMemo(() => (isFetching ? [] : vendorItems), [isFetching, vendorItems]);

  const { collection, set } = useListCollection<VendorAutocompleteItem>({
    initialItems: visibleItems,
    itemToString: (item) => item.name,
    itemToValue: (item) => item.id,
  });

  useEffect(() => {
    set(visibleItems);
  }, [visibleItems, set]);

  useEffect(() => {
    if (!searchText || value || isFetching) {
      return;
    }
    if (searchText.length < MIN_CHARS_FOR_NO_RESULTS) {
      return;
    }
    if (vendors.length === 0) {
      onNoResults(searchText);
    }
  }, [searchText, isFetching, value, vendors.length, onNoResults]);

  const comboboxValue = value ? [value] : [];
  const emptyMessage = isFetching ? 'Searching…' : 'No matches';

  return (
    <Combobox.Root
      w="full"
      collection={collection}
      value={comboboxValue}
      openOnClick
      positioning={{ strategy: 'fixed', hideWhenDetached: true }}
      selectionBehavior="replace"
      onValueChange={(details) => {
        const [nextId] = details.value;
        if (nextId === undefined) {
          onChange(null);
          setSelectedVendor(null);
          setSearchText('');
          return;
        }
        const resolved = vendors.find((item) => item.id === nextId) ?? null;
        onChange(nextId);
        setSelectedVendor(resolved);
      }}
      onInputValueChange={(details) => {
        setSearchText(details.inputValue);
      }}
    >
      <Combobox.Label asChild>
        <Text textStyle="fieldLabel" mb="1.5" display="block">
          {label}
        </Text>
      </Combobox.Label>
      <Combobox.Control w="full">
        <InputGroup
          startElement={<Search size={18} strokeWidth={2} />}
          startElementProps={{ color: 'text.secondary', pointerEvents: 'none', lineHeight: 0 }}
          endElement={
            <Combobox.IndicatorGroup>
              <Combobox.ClearTrigger aria-label={`Clear ${label}`} cursor="pointer" />
            </Combobox.IndicatorGroup>
          }
          w="full"
        >
          <Combobox.Input
            borderRadius="full"
            borderColor="border.primary"
            bg="bg.primary"
            placeholder={placeholder}
            py="2"
            fontSize="sm"
            w="full"
          />
        </InputGroup>
      </Combobox.Control>
      <Combobox.Positioner>
        <Combobox.Content
          maxH="40"
          overflowY="auto"
          borderWidth="1px"
          borderColor="border.primary"
          borderRadius="md"
          bg="bg.primary"
          boxShadow="md"
        >
          <Combobox.Empty py="3" px="3" textStyle="helperText">
            {emptyMessage}
          </Combobox.Empty>
          {visibleItems.map((item) => (
            <Combobox.Item key={item.id} item={item} px="3" py="2" minH="10" cursor="pointer">
              <Combobox.ItemText fontSize="sm" fontWeight="normal">
                {item.name}
              </Combobox.ItemText>
            </Combobox.Item>
          ))}
        </Combobox.Content>
      </Combobox.Positioner>
    </Combobox.Root>
  );
}
