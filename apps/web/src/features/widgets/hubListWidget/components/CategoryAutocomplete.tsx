import { Combobox, InputGroup, Text, useFilter, useListCollection } from '@chakra-ui/react';
import { Search } from 'lucide-react';
import type { ReactElement } from 'react';

export type CategoryAutocompleteItem = { id: string; name: string };

type CategoryAutocompleteProps = {
  label: string;
  items: CategoryAutocompleteItem[];
  value: string | null;
  onChange: (itemId: string | null) => void;
  placeholder: string;
};

export function CategoryAutocomplete({
  label,
  items,
  value,
  onChange,
  placeholder,
}: CategoryAutocompleteProps): ReactElement {
  const filterFns = useFilter({ sensitivity: 'base' });

  const { collection, filter } = useListCollection<CategoryAutocompleteItem>({
    initialItems: items,
    itemToString: (item) => item.name,
    itemToValue: (item) => item.id,
    filter: (itemText, filterText) => filterFns.contains(itemText, filterText),
  });

  const comboboxValue = value ? [value] : [];

  return (
    <Combobox.Root
      w="full"
      collection={collection}
      value={comboboxValue}
      openOnClick
      positioning={{ strategy: 'fixed', hideWhenDetached: true }}
      selectionBehavior="replace"
      onInputValueChange={(details) => {
        filter(details.inputValue);
      }}
      onValueChange={(details) => {
        const [nextId] = details.value;
        onChange(nextId ?? null);
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
            No matches
          </Combobox.Empty>
          {collection.items.map((item) => (
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
