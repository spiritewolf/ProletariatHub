import { Field, NativeSelect } from '@chakra-ui/react';
import type { ReactElement } from 'react';
import { type Control, Controller, type FieldPath, type FieldValues } from 'react-hook-form';

type NativeSelectWithLabelProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  fieldLabel: string;
  options: { value: string; label: string }[];
  errorMessage?: string;
};

export function NativeSelectWithLabel<TFieldValues extends FieldValues>({
  control,
  name,
  fieldLabel,
  options,
  errorMessage,
}: NativeSelectWithLabelProps<TFieldValues>): ReactElement {
  return (
    <Field.Root invalid={errorMessage !== undefined}>
      <Field.Label textStyle="fieldLabel">{fieldLabel}</Field.Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <NativeSelect.Root size="md" variant="outline" w="full">
            <NativeSelect.Field
              borderRadius="full"
              borderColor="border.primary"
              bg="bg.primary"
              value={field.value ?? ''}
              onChange={(event) => {
                field.onChange(event.target.value);
              }}
              onBlur={field.onBlur}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        )}
      />
      {errorMessage ? <Field.ErrorText>{errorMessage}</Field.ErrorText> : null}
    </Field.Root>
  );
}
