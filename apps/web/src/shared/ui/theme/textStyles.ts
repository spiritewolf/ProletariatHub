import { defineTextStyles } from '@chakra-ui/react';

export const textStyles = defineTextStyles({
  fieldLabel: {
    value: {
      fontSize: 'xs',
      fontWeight: 'medium',
      color: 'text.primary',
    },
  },
  helperText: {
    value: {
      fontSize: 'sm',
      color: 'text.secondary',
    },
  },
});
