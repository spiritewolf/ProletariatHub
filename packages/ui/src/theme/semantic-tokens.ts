import { defineSemanticTokens } from '@chakra-ui/react';

export const semanticTokens = defineSemanticTokens({
  colors: {
    // ── Backgrounds ──
    bg: {
      primary: {
        value: { _light: '{colors.white}', _dark: '{colors.navy.900}' },
      },
      secondary: {
        value: { _light: '{colors.rose.50}', _dark: '{colors.navy.700}' },
      },
      dark: {
        value: { _light: '{colors.canvas.light}', _dark: '{colors.navy.950}' },
      },
      light: {
        value: { _light: '{colors.rose.50}', _dark: '{colors.navy.600}' },
      },
    },

    // ── Header ──
    header: {
      primary: {
        value: { _light: '{colors.rose.900}', _dark: '{colors.navy.600}' },
      },
      secondary: {
        value: { _light: '{colors.rose.950}', _dark: '{colors.navy.400}' },
      },
    },

    // ── Topbar ──
    topbar: {
      primary: {
        value: { _light: '{colors.rose.900}', _dark: '{colors.navy.700}' },
      },
      secondary: {
        value: { _light: '{colors.rose.950}', _dark: '{colors.navy.600}' },
      },
    },

    // ── Text ──
    text: {
      primary: {
        value: { _light: '{colors.maroon.800}', _dark: '#C9FDF1' },
      },
      secondary: {
        value: { _light: '{colors.gray.700}', _dark: '#7C9C9E' },
      },
      tertiary: {
        value: { _light: '{colors.rose.50}', _dark: '{colors.purple.200}' },
      },
      light: {
        value: { _light: '{colors.white}', _dark: '#C9FDF1' },
      },
    },

    // ── Borders ──
    border: {
      primary: {
        value: { _light: '{colors.rose.300}', _dark: '{colors.navy.400}' },
      },
      secondary: {
        value: { _light: '{colors.rose.200}', _dark: '{colors.navy.700}' },
      },
    },

    // ── Accent ──
    accent: {
      primary: {
        value: { _light: '{colors.rose.600}', _dark: '{colors.radical.pink}' },
      },
      hover: {
        value: { _light: '{colors.rose.700}', _dark: '{colors.radical.pinkHover}' },
      },
      secondary: {
        value: { _light: '{colors.rose.800}', _dark: '{colors.radical.mint}' },
      },
    },

    // ── Brand (direct-use go-to colors) ──
    brand: {
      primary: {
        value: { _light: '{colors.rose.600}', _dark: '{colors.radical.pink}' },
      },
      secondary: {
        value: { _light: '{colors.rose.800}', _dark: '{colors.radical.mint}' },
      },
      tertiary: {
        value: { _light: '{colors.rose.700}', _dark: '{colors.radical.pinkHover}' },
      },
    },

    // ── Status (direct-use indicators) ──
    status: {
      success: {
        value: { _light: '#4CAF50', _dark: '{colors.radical.mint}' },
      },
      warning: {
        value: { _light: '#F7A409', _dark: '{colors.radical.orange}' },
      },
      error: {
        value: { _light: '#D32F2F', _dark: '{colors.radical.coral}' },
      },
      info: {
        value: { _light: '#1976D2', _dark: '{colors.radical.cyan}' },
      },
      neutral: {
        value: { _light: '{colors.gray.700}', _dark: '{colors.gray.200}' },
      },
    },

    // ── Priority (direct-use indicators) ──
    priority: {
      urgent: {
        value: { _light: '#D32F2F', _dark: '{colors.radical.coral}' },
      },
      high: {
        value: { _light: '{colors.rose.500}', _dark: '{colors.radical.pink}' },
      },
      medium: {
        value: { _light: '#F48FB1', _dark: '{colors.radical.orange}' },
      },
      low: {
        value: { _light: '#81C784', _dark: '{colors.radical.mint}' },
      },
    },

    // ── Color Palettes (for colorPalette prop on Button, Badge, etc.) ──

    // Default button palette
    brandPalette: {
      solid: { value: { _light: '{colors.rose.600}', _dark: '{colors.radical.pink}' } },
      contrast: { value: { _light: '{colors.white}', _dark: '{colors.white}' } },
      fg: { value: { _light: '{colors.rose.600}', _dark: '{colors.radical.pink}' } },
      subtle: { value: { _light: '{colors.rose.100}', _dark: '{colors.navy.800}' } },
      muted: { value: { _light: '{colors.rose.200}', _dark: '{colors.navy.700}' } },
      emphasized: {
        value: {
          _light: '{colors.rose.300}',
          _dark: 'color-mix(in srgb, {colors.radical.pink} 40%, transparent)',
        },
      },
      focusRing: { value: { _light: '{colors.rose.600}', _dark: '{colors.radical.pink}' } },
      border: { value: { _light: '{colors.rose.600}', _dark: '{colors.radical.pink}' } },
    },

    // Default badge palette
    neutral: {
      solid: { value: { _light: '{colors.gray.700}', _dark: '{colors.gray.200}' } },
      contrast: { value: { _light: '{colors.white}', _dark: '#12111F' } },
      fg: { value: { _light: '{colors.gray.700}', _dark: '{colors.gray.200}' } },
      subtle: { value: { _light: '#F0E8EC', _dark: '#1A192C' } },
      muted: { value: { _light: '#E0D4DA', _dark: '#232048' } },
      emphasized: { value: { _light: '{colors.gray.700}', _dark: '{colors.gray.200}' } },
      focusRing: { value: { _light: '{colors.gray.700}', _dark: '{colors.gray.200}' } },
      border: { value: { _light: '{colors.gray.700}', _dark: '{colors.gray.200}' } },
    },

    success: {
      solid: { value: { _light: '#4CAF50', _dark: '{colors.radical.mint}' } },
      contrast: { value: { _light: '{colors.white}', _dark: '#12111F' } },
      fg: { value: { _light: '#2E7D32', _dark: '{colors.radical.mint}' } },
      subtle: { value: { _light: '#E8F5E9', _dark: '#1A2E2C' } },
      muted: { value: { _light: '#C8E6C9', _dark: '#223836' } },
      emphasized: { value: { _light: '#4CAF50', _dark: '{colors.radical.mint}' } },
      focusRing: { value: { _light: '#4CAF50', _dark: '{colors.radical.mint}' } },
      border: { value: { _light: '#4CAF50', _dark: '{colors.radical.mint}' } },
    },

    warning: {
      solid: { value: { _light: '#F7A409', _dark: '{colors.radical.orange}' } },
      contrast: { value: { _light: '{colors.white}', _dark: '#12111F' } },
      fg: { value: { _light: '#E65100', _dark: '{colors.radical.orange}' } },
      subtle: { value: { _light: '#FFF3E0', _dark: '#3A3020' } },
      muted: { value: { _light: '#FFE0B2', _dark: '#453828' } },
      emphasized: { value: { _light: '#F7A409', _dark: '{colors.radical.orange}' } },
      focusRing: { value: { _light: '#F7A409', _dark: '{colors.radical.orange}' } },
      border: { value: { _light: '#F7A409', _dark: '{colors.radical.orange}' } },
    },

    error: {
      solid: { value: { _light: '#D32F2F', _dark: '{colors.radical.coral}' } },
      contrast: { value: { _light: '{colors.white}', _dark: '{colors.white}' } },
      fg: { value: { _light: '#D32F2F', _dark: '{colors.radical.coral}' } },
      subtle: { value: { _light: '#FFEBEE', _dark: '#3D2429' } },
      muted: { value: { _light: '#FFCDD2', _dark: '#4A2E34' } },
      emphasized: { value: { _light: '#D32F2F', _dark: '{colors.radical.coral}' } },
      focusRing: { value: { _light: '#D32F2F', _dark: '{colors.radical.coral}' } },
      border: { value: { _light: '#D32F2F', _dark: '{colors.radical.coral}' } },
    },

    info: {
      solid: { value: { _light: '#1976D2', _dark: '{colors.radical.cyan}' } },
      contrast: { value: { _light: '{colors.white}', _dark: '#12111F' } },
      fg: { value: { _light: '#1565C0', _dark: '{colors.radical.cyan}' } },
      subtle: { value: { _light: '#E3F2FD', _dark: '#1A2030' } },
      muted: { value: { _light: '#BBDEFB', _dark: '#223040' } },
      emphasized: { value: { _light: '#1976D2', _dark: '{colors.radical.cyan}' } },
      focusRing: { value: { _light: '#1976D2', _dark: '{colors.radical.cyan}' } },
      border: { value: { _light: '#1976D2', _dark: '{colors.radical.cyan}' } },
    },
  },

  // Chakra v3 internal aliases — recipes reference these
  radii: {
    l1: { value: '{radii.sm}' },
    l2: { value: '{radii.lg}' },
    l3: { value: '{radii.lg}' },
  },

  shadows: {
    card: {
      value: { _light: '{shadows.cardRestLight}', _dark: '{shadows.radicalGlowRest}' },
    },
    glow: {
      value: { _light: '{shadows.glowRestLight}', _dark: '{shadows.radicalGlowStrong}' },
    },
    cardHalo: {
      value: { _light: '{shadows.cardRestLight}', _dark: '{shadows.radicalGlowNeon}' },
    },
  },
});
