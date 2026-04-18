import {
  Combobox,
  Field,
  Portal,
  Stack,
  Text,
  useFilter,
  useListCollection,
} from '@chakra-ui/react';
import { type ReactElement, ReactNode, useEffect } from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

type ComboBoxWithLabelProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  errorMessage?: string;
  initialItems: { value: string; label: string }[];
  onValueChange?: (value: string) => void;
  onInputValueChange?: (value: string) => void;
  inputPlaceholder?: string;
  emptyText?: string;
  emptyComponent?: ReactNode;
  fieldLabel: string;
};

export function ComboBoxWithLabel<TFieldValues extends FieldValues>({
  control,
  errorMessage,
  initialItems,
  name,
  onValueChange,
  onInputValueChange,
  inputPlaceholder,
  emptyText,
  emptyComponent,
  fieldLabel,
}: ComboBoxWithLabelProps<TFieldValues>): ReactElement {
  const filterFns = useFilter({ sensitivity: 'base' });

  const { collection, filter, set } = useListCollection({
    initialItems,
    filter: (itemText, filterText) => filterFns.contains(itemText, filterText),
  });

  useEffect(() => {
    set(initialItems);
  }, [initialItems, set]);

  return (
    <Field.Root>
      <Field.Label>{fieldLabel}</Field.Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Combobox.Root
            collection={collection}
            value={field.value ? [field.value] : []}
            onValueChange={({ value }) => {
              field.onChange(value[0] || '');
              onValueChange?.(value[0] || '');
            }}
            onInputValueChange={(details) => {
              onInputValueChange?.(details.inputValue);
              filter(details.inputValue);
            }}
            onInteractOutside={() => field.onBlur()}
          >
            <Combobox.Control>
              <Combobox.Input
                placeholder={inputPlaceholder ?? ''}
                borderRadius="full"
                borderColor="border.primary"
                bg="bg.primary"
                py="2"
                fontSize="sm"
                w="full"
              />
              <Combobox.IndicatorGroup>
                <Combobox.ClearTrigger />
                <Combobox.Trigger />
              </Combobox.IndicatorGroup>
            </Combobox.Control>

            <Portal>
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
                  {emptyText || emptyComponent ? (
                    <Combobox.Empty>
                      <Stack>
                        {emptyText ? <Text textStyle="helperText">{emptyText}</Text> : null}
                        {emptyComponent ? emptyComponent : null}
                      </Stack>
                    </Combobox.Empty>
                  ) : null}
                  {collection.items.map((item) => (
                    <Combobox.Item key={item.value} item={item}>
                      {item.label}
                      <Combobox.ItemIndicator />
                    </Combobox.Item>
                  ))}
                </Combobox.Content>
              </Combobox.Positioner>
            </Portal>
          </Combobox.Root>
        )}
      />
      {errorMessage ? <Field.ErrorText>{errorMessage}</Field.ErrorText> : null}
    </Field.Root>
  );
}
