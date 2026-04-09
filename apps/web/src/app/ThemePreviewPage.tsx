import { Badge, Box, Button, Card, Grid, Heading, Input, Stack, Text } from '@chakra-ui/react';
import {
  ChakraBadgeVariant,
  ChakraButtonVariant,
  ChakraCardVariant,
  ChakraColorPalette,
  PRIORITY_BADGE_ROWS,
  THEME_PREVIEW_BUTTON_SIZES,
} from '@proletariat-hub/web/shared/constants/theme-preview';
import { ColorModeToggle } from '@proletariat-hub/web/shared/ui/ColorModeToggle';
import type { ReactElement, ReactNode } from 'react';

const PALETTE_SWATCHES: ReadonlyArray<{
  hexLight: string;
  hexDark: string;
  label: string;
  token: string;
}> = [
  { label: 'bg.page', token: 'bg.page', hexLight: '#F8ECF0', hexDark: '#141228' },
  { label: 'bg.surface', token: 'bg.surface', hexLight: '#FFFFFF', hexDark: '#1A1640' },
  { label: 'bg.surface.muted', token: 'bg.surface.muted', hexLight: '#FDF2F5', hexDark: '#1E1A4A' },
  { label: 'bg.header', token: 'bg.header', hexLight: '#6B1D3A', hexDark: '#1A1640' },
  { label: 'bg.header.dark', token: 'bg.header.dark', hexLight: '#4A1228', hexDark: '#0F0D20' },
  { label: 'bg.callout', token: 'bg.callout', hexLight: '#FDE8EE', hexDark: '#1E1A4A' },
  { label: 'border.default', token: 'border.default', hexLight: '#E8B4C8', hexDark: '#2D2B55' },
  { label: 'border.subtle', token: 'border.subtle', hexLight: '#F0D4E0', hexDark: '#232048' },
  { label: 'text.primary', token: 'text.primary', hexLight: '#2D1B30', hexDark: '#E4E4E4' },
  { label: 'text.secondary', token: 'text.secondary', hexLight: '#6B5B6E', hexDark: '#8A8A9E' },
  { label: 'text.onHeader', token: 'text.onHeader', hexLight: '#FFFFFF', hexDark: '#E4E4E4' },
  { label: 'accent.primary', token: 'accent.primary', hexLight: '#C2185B', hexDark: '#FF428E' },
  {
    label: 'accent.primary.hover',
    token: 'accent.primary.hover',
    hexLight: '#AD1457',
    hexDark: '#FF5C9E',
  },
  { label: 'accent.secondary', token: 'accent.secondary', hexLight: '#8E244D', hexDark: '#A8FFEF' },
  { label: 'priority.urgent', token: 'priority.urgent', hexLight: '#D32F2F', hexDark: '#FF594C' },
  { label: 'priority.high', token: 'priority.high', hexLight: '#E91E63', hexDark: '#FF428E' },
  { label: 'priority.medium', token: 'priority.medium', hexLight: '#F48FB1', hexDark: '#F7A409' },
  { label: 'priority.low', token: 'priority.low', hexLight: '#81C784', hexDark: '#A8FFEF' },
  { label: 'status.success', token: 'status.success', hexLight: '#4CAF50', hexDark: '#A8FFEF' },
  { label: 'status.warning', token: 'status.warning', hexLight: '#F7A409', hexDark: '#DFF959' },
  { label: 'status.error', token: 'status.error', hexLight: '#D32F2F', hexDark: '#FF594C' },
];

function SectionLabel(props: { children: ReactNode }): ReactElement {
  return (
    <Heading as="h2" size="lg" mb="3">
      {props.children}
    </Heading>
  );
}

export function ThemePreviewPage(): ReactElement {
  return (
    <Box minH="100dvh" bg="bg.page" color="text.primary" pb="24">
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
          <SectionLabel>Color mode</SectionLabel>
          <Text color="text.secondary" fontSize="sm" mb="3">
            Use the fixed controls at the bottom-right (light / dark / system).
          </Text>
        </Box>

        <Box>
          <SectionLabel>Semantic color swatches</SectionLabel>
          <Text color="text.secondary" fontSize="sm" mb="4">
            Reference hex values from the spec; rendered swatches use semantic tokens.
          </Text>
          <Grid
            templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
            gap="4"
          >
            {PALETTE_SWATCHES.map((row) => (
              <Box
                key={row.token}
                borderWidth="1px"
                borderColor="border.default"
                borderRadius="l3"
                overflow="hidden"
                shadow="card"
              >
                <Box bg={row.token} h="14" w="100%" />
                <Stack gap="0.5" p="3" bg="bg.surface">
                  <Text fontWeight="semibold" fontSize="sm">
                    {row.label}
                  </Text>
                  <Text fontSize="xs" color="text.secondary">
                    Light: {row.hexLight}
                  </Text>
                  <Text fontSize="xs" color="text.secondary">
                    Dark: {row.hexDark}
                  </Text>
                </Stack>
              </Box>
            ))}
          </Grid>
        </Box>

        <Box>
          <SectionLabel>Header bar</SectionLabel>
          <Box
            bg="bg.header"
            borderRadius="l3"
            px={{ base: '4', md: '6' }}
            py={{ base: '3', md: '4' }}
          >
            <Text color="text.onHeader" fontWeight="bold">
              Lorem ipsum dolor sit amet
            </Text>
            <Text color="text.onHeader" fontSize="sm" opacity={0.9}>
              Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
            </Text>
          </Box>
        </Box>

        <Box>
          <SectionLabel>Callout</SectionLabel>
          <Box
            bg="bg.callout"
            borderRadius="l3"
            borderWidth="1px"
            borderColor="border.subtle"
            p="4"
          >
            <Text fontWeight="semibold">Lorem ipsum dolor</Text>
            <Text color="text.secondary" fontSize="sm" mt="1">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </Text>
          </Box>
        </Box>

        <Box>
          <SectionLabel>Buttons</SectionLabel>
          <Text color="text.secondary" fontSize="sm" mb="4">
            Primary uses solid + brand palette; outline + ghost use the same palette.
          </Text>
          <Stack gap="6">
            {THEME_PREVIEW_BUTTON_SIZES.map((size) => (
              <Stack key={size} gap="3" align="flex-start">
                <Text fontSize="sm" fontWeight="semibold" color="text.secondary">
                  Size {size}
                </Text>
                <Stack direction={{ base: 'column', sm: 'row' }} gap="3" wrap="wrap">
                  <Button
                    colorPalette={ChakraColorPalette.BRAND}
                    size={size}
                    variant={ChakraButtonVariant.SOLID}
                  >
                    Solid primary
                  </Button>
                  <Button
                    colorPalette={ChakraColorPalette.BRAND}
                    size={size}
                    variant={ChakraButtonVariant.OUTLINE}
                  >
                    Outline
                  </Button>
                  <Button
                    colorPalette={ChakraColorPalette.BRAND}
                    size={size}
                    variant={ChakraButtonVariant.GHOST}
                  >
                    Ghost
                  </Button>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Box>
          <SectionLabel>Card</SectionLabel>
          <Card.Root maxW="md" variant={ChakraCardVariant.OUTLINE}>
            <Card.Header>
              <Card.Title>Duis aute irure dolor</Card.Title>
              <Card.Description>Excepteur sint occaecat · cupidatat non proident</Card.Description>
            </Card.Header>
            <Card.Body>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </Text>
              <Text color="text.secondary" fontSize="sm" mt="2">
                Muted line for secondary emphasis on cards.
              </Text>
            </Card.Body>
          </Card.Root>
        </Box>

        <Box>
          <SectionLabel>Inputs</SectionLabel>
          <Stack gap="4" maxW="md">
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb="1.5">
                Default
              </Text>
              <Input placeholder="Lorem ipsum dolor sit amet…" />
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb="1.5">
                Focused (tab into this field)
              </Text>
              <Input autoFocus placeholder="Focus ring uses accent" />
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb="1.5">
                Disabled
              </Text>
              <Input disabled placeholder="Disabled" value="Ut enim ad minim veniam" />
            </Box>
          </Stack>
        </Box>

        <Box>
          <SectionLabel>Badges (priority)</SectionLabel>
          <Stack gap="4">
            <Box>
              <Text fontSize="sm" fontWeight="semibold" color="text.secondary" mb="2">
                Subtle
              </Text>
              <Stack direction="row" gap="2" wrap="wrap">
                {PRIORITY_BADGE_ROWS.map((row) => (
                  <Badge
                    key={row.key}
                    colorPalette={row.palette}
                    variant={ChakraBadgeVariant.SUBTLE}
                  >
                    {row.label}
                  </Badge>
                ))}
              </Stack>
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="semibold" color="text.secondary" mb="2">
                Solid
              </Text>
              <Stack direction="row" gap="2" wrap="wrap">
                {PRIORITY_BADGE_ROWS.map((row) => (
                  <Badge
                    key={row.key}
                    colorPalette={row.palette}
                    variant={ChakraBadgeVariant.SOLID}
                  >
                    {row.label}
                  </Badge>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Box>
          <SectionLabel>Typography scale</SectionLabel>
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
            <Text>
              Body text uses{' '}
              <Text as="span" color="text.primary" fontWeight="semibold">
                text.primary
              </Text>{' '}
              for readable agitation.
            </Text>
            <Text color="text.secondary" fontSize="sm">
              Secondary copy uses text.secondary for captions, hints, and whispered dissent.
            </Text>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
