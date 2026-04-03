import { Button, Flex } from '@chakra-ui/react';

import { dashboardTheme } from '../../styles/dashboardTheme';

type TabOption<T extends string> = {
  value: T;
  label: string;
};

type TabRowProps<T extends string> = {
  value: T;
  options: readonly TabOption<T>[];
  onChange: (next: T) => void;
  mb?: number | string;
};

export function TabRow<T extends string>({
  value,
  options,
  onChange,
  mb,
}: TabRowProps<T>): React.ReactElement {
  return (
    <Flex gap={1} flexWrap="wrap" mb={mb}>
      {options.map((option) => (
        <Button
          key={option.value}
          type="button"
          size="xs"
          fontSize="9px"
          h="22px"
          variant={value === option.value ? 'solid' : 'outline'}
          bg={value === option.value ? dashboardTheme.title : 'transparent'}
          color={value === option.value ? 'white' : dashboardTheme.title}
          borderColor={dashboardTheme.cardBorder}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </Flex>
  );
}
