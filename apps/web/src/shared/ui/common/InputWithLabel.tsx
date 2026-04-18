import {
  Field,
  type FieldRootProps,
  Input,
  InputGroup,
  type InputGroupProps,
  type InputProps,
} from '@chakra-ui/react';
import type { ReactElement } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

type InputWithLabelProps = {
  isRootInvalid?: boolean;
  rootWidth?: FieldRootProps['w'];
  rootFlexShrink?: FieldRootProps['flexShrink'];
  rootFlex?: FieldRootProps['flex'];
  rootMinW?: FieldRootProps['minW'];
  inputType?: InputProps['type'];
  inputAutoComplete?: InputProps['autoComplete'];
  inputReadOnly?: InputProps['readOnly'];
  inputDisabled?: InputProps['disabled'];
  inputBg?: InputProps['bg'];
  inputMin?: InputProps['min'];
  inputStep?: InputProps['step'];
  inputPadding?: InputProps['p'];
  inputValue?: InputProps['value'];
  inputOnChange?: InputProps['onChange'];
  inputLabel?: string;
  inputHelperText?: string;
  inputPlaceholder?: string;
  registerMethods?: UseFormRegisterReturn;
  startElement?: InputGroupProps['startElement'];
  endElement?: InputGroupProps['endElement'];
  errorMessage?: string;
};

export function InputWithLabel({
  isRootInvalid = false,
  rootWidth,
  rootFlexShrink,
  rootFlex,
  rootMinW,
  inputType = 'text',
  inputAutoComplete,
  inputReadOnly,
  inputDisabled,
  inputBg,
  inputMin,
  inputStep,
  inputPadding,
  inputValue,
  inputOnChange,
  inputLabel,
  inputHelperText,
  inputPlaceholder,
  registerMethods,
  startElement,
  endElement,
  errorMessage,
}: InputWithLabelProps): ReactElement {
  return (
    <Field.Root
      w={rootWidth}
      flexShrink={rootFlexShrink}
      flex={rootFlex}
      minW={rootMinW}
      invalid={isRootInvalid}
    >
      {inputLabel ? (
        <Field.Label textStyle="fieldLabel" color="text.secondary">
          {inputLabel}
        </Field.Label>
      ) : null}
      <InputGroup startElement={startElement} endElement={endElement} w="full">
        <Input
          shape="pill"
          type={inputType}
          autoComplete={inputAutoComplete}
          readOnly={inputReadOnly}
          disabled={inputDisabled}
          bg={inputBg}
          placeholder={inputPlaceholder}
          min={inputMin}
          step={inputStep}
          p={inputPadding}
          value={inputValue}
          onChange={inputOnChange}
          {...registerMethods}
        />
      </InputGroup>
      {inputHelperText ? (
        <Field.HelperText textStyle="helperText">{inputHelperText}</Field.HelperText>
      ) : null}
      {errorMessage ? <Field.ErrorText>{errorMessage}</Field.ErrorText> : null}
    </Field.Root>
  );
}
