import { Box, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import type { ReactElement, ReactNode } from 'react';

import { ColorModeToggle } from './ColorModeToggle';

const PALETTE_SWATCHES: {
  label: string;
  token: string;
}[] = [
  { label: 'bg.primary', token: 'bg.primary' },
  { label: 'bg.secondary', token: 'bg.secondary' },
  { label: 'bg.dark', token: 'bg.dark' },
  { label: 'bg.light', token: 'bg.light' },
  { label: 'header.primary', token: 'header.primary' },
  { label: 'header.secondary', token: 'header.secondary' },
  { label: 'border.primary', token: 'border.primary' },
  { label: 'border.secondary', token: 'border.secondary' },
  { label: 'text.primary', token: 'text.primary' },
  { label: 'text.secondary', token: 'text.secondary' },
  { label: 'text.light', token: 'text.light' },
  { label: 'accent.primary', token: 'accent.primary' },
  { label: 'accent.hover', token: 'accent.hover' },
  { label: 'accent.secondary', token: 'accent.secondary' },
  { label: 'brand.primary', token: 'brand.primary' },
  { label: 'brand.secondary', token: 'brand.secondary' },
  { label: 'brand.tertiary', token: 'brand.tertiary' },
  { label: 'status.success', token: 'status.success' },
  { label: 'status.warning', token: 'status.warning' },
  { label: 'status.error', token: 'status.error' },
  { label: 'status.info', token: 'status.info' },
  { label: 'status.neutral', token: 'status.neutral' },
  { label: 'priority.urgent', token: 'priority.urgent' },
  { label: 'priority.high', token: 'priority.high' },
  { label: 'priority.medium', token: 'priority.medium' },
  { label: 'priority.low', token: 'priority.low' },
];

function SectionLabel(props: { children: ReactNode }): ReactElement {
  return (
    <Heading as="h2" size="lg" mb="3">
      {props.children}
    </Heading>
  );
}

export function ThemePreview(): ReactElement {
  return (
    <Box minH="100dvh" bg="bg.dark" color="text.primary" pb="24">
      <ColorModeToggle />

      <Stack
        gap={{ base: '10', md: '12' }}
        maxW="4xl"
        mx="auto"
        px={{ base: '4', md: '8' }}
        py={{ base: '8', md: '12' }}
      >
        <Stack gap="2">
          <Heading as="h1" size="3xl">
            ProletariatHub theme preview
          </Heading>
          <Text color="text.secondary" textStyle="sm">
            Marxist warmth in light mode; Radical neon in dark. Toggle mode with the floating
            controls.
          </Text>
        </Stack>

        <Box>
          <SectionLabel>Semantic color swatches</SectionLabel>
          <Grid
            templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
            gap="4"
          >
            {PALETTE_SWATCHES.map((row) => (
              <Box
                key={row.token}
                borderWidth="1px"
                borderColor="border.primary"
                borderRadius="l3"
                overflow="hidden"
                shadow="card"
              >
                <Box bg={row.token} h="14" w="100%" />
                <Stack gap="0.5" p="3" bg="bg.primary">
                  <Text fontWeight="semibold" fontSize="sm">
                    {row.label}
                  </Text>
                </Stack>
              </Box>
            ))}
          </Grid>
        </Box>

        <Box>
          <SectionLabel>Header — primary</SectionLabel>
          <Box
            bg="header.primary"
            borderRadius="l3"
            px={{ base: '4', md: '6' }}
            py={{ base: '3', md: '4' }}
          >
            <Text color="text.light" fontWeight="bold">
              Lorem ipsum dolor sit amet
            </Text>
            <Text color="text.light" fontSize="sm" opacity={0.9}>
              Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
            </Text>
          </Box>
        </Box>

        <Box>
          <SectionLabel>Header — secondary</SectionLabel>
          <Box
            bg="header.secondary"
            borderRadius="l3"
            px={{ base: '4', md: '6' }}
            py={{ base: '3', md: '4' }}
          >
            <Text color="text.light" fontWeight="bold">
              Lorem ipsum dolor sit amet
            </Text>
            <Text color="text.light" fontSize="sm" opacity={0.9}>
              Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
            </Text>
          </Box>
        </Box>

        <Box>
          <SectionLabel>Background — primary</SectionLabel>
          <Box
            bg="bg.primary"
            borderRadius="l3"
            borderWidth="1px"
            borderColor="border.primary"
            px={{ base: '4', md: '6' }}
            py={{ base: '3', md: '4' }}
          >
            <Text color="text.primary" fontWeight="bold">
              Lorem ipsum dolor sit amet
            </Text>
            <Text color="text.secondary" fontSize="sm">
              Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
            </Text>
          </Box>
        </Box>

        <Box>
          <SectionLabel>Background — secondary</SectionLabel>
          <Box
            bg="bg.secondary"
            borderRadius="l3"
            borderWidth="1px"
            borderColor="border.primary"
            px={{ base: '4', md: '6' }}
            py={{ base: '3', md: '4' }}
          >
            <Text color="text.primary" fontWeight="bold">
              Lorem ipsum dolor sit amet
            </Text>
            <Text color="text.secondary" fontSize="sm">
              Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
            </Text>
          </Box>
        </Box>

        <Box>
          <SectionLabel>Background — light</SectionLabel>
          <Box
            bg="bg.light"
            borderRadius="l3"
            borderWidth="1px"
            borderColor="border.secondary"
            px={{ base: '4', md: '6' }}
            py={{ base: '3', md: '4' }}
          >
            <Text color="text.primary" fontWeight="bold">
              Lorem ipsum dolor sit amet
            </Text>
            <Text color="text.secondary" fontSize="sm">
              Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
            </Text>
          </Box>
        </Box>

        <Box>
          <SectionLabel>Typography</SectionLabel>
          <Stack gap="3">
            <Heading as="h1" size="4xl">
              Heading 4xl
            </Heading>
            <Heading as="h2" size="2xl">
              Heading 2xl
            </Heading>
            <Heading as="h3" size="lg">
              Heading lg
            </Heading>
            <Text color="text.primary">Body text for primary content.</Text>
            <Text color="text.secondary" fontSize="sm">
              For captions and hints.
            </Text>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
