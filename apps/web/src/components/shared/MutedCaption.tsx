import { Text } from '@chakra-ui/react';

type MutedCaptionProps = {
  text: string;
  mutedColor: string;
  fontSize?: string;
};

export function MutedCaption({
  text,
  mutedColor,
  fontSize = '9px',
}: MutedCaptionProps) {
  return (
    <Text fontSize={fontSize} color={mutedColor}>
      {text}
    </Text>
  );
}
