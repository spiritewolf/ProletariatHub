import { defineSemanticTokens } from '@chakra-ui/react';

export const semanticTokens = defineSemanticTokens({
  colors: {
    // ── Backgrounds ──
    bg: {
      primary: {
        value: { base: '{colors.white}', _dark: '{colors.navy.900}' },
      },
      secondary: {
        value: { base: '{colors.rose.50}', _dark: '{colors.navy.700}' },
      },
      dark: {
        value: { base: '{colors.canvas.light}', _dark: '{colors.navy.950}' },
      },
      light: {
        value: { base: '{colors.rose.50}', _dark: '{colors.navy.600}' },
      },
      input: {
        value: { base: '{colors.white}', _dark: '{colors.navy.600}' },
      },
    },

    // ── Header ──
    header: {
      primary: {
        value: { base: '{colors.rose.900}', _dark: '{colors.navy.600}' },
      },
      secondary: {
        value: { base: '{colors.rose.950}', _dark: '{colors.navy.400}' },
      },
    },

    // ── Topbar ──
    topbar: {
      primary: {
        value: { base: '{colors.rose.900}', _dark: '{colors.navy.700}' },
      },
      secondary: {
        value: { base: '{colors.rose.950}', _dark: '{colors.navy.600}' },
      },
    },

    // ── Text ──
    text: {
      primary: {
        value: { base: '{colors.maroon.800}', _dark: '#C9FDF1' },
      },
      secondary: {
        value: { base: '{colors.gray.700}', _dark: '#7C9C9E' },
      },
      tertiary: {
        value: { base: '{colors.rose.50}', _dark: '{colors.purple.200}' },
      },
      light: {
        value: { base: '{colors.white}', _dark: '#C9FDF1' },
      },
    },

    // ── Borders ──
    border: {
      primary: {
        value: { base: '{colors.rose.300}', _dark: '{colors.navy.400}' },
      },
      secondary: {
        value: { base: '{colors.rose.200}', _dark: '{colors.navy.700}' },
      },
    },

    // ── Hub list widget (priority pill fills + label colors + row/divider borders in dark mode) ──
    hubList: {
      border: {
        value: {
          base: '{colors.rose.200}',
          _dark: '{colors.navy.500}',
        },
      },
      priorityMedium: {
        bg: {
          value: {
            base: '#E3F2FD',
            _dark: '#1A2633',
          },
        },
        fg: {
          value: {
            base: '#1565C0',
            _dark: '#7DA7B8',
          },
        },
      },
      priorityLow: {
        bg: {
          value: {
            base: '#E8F5E9',
            _dark: '#1A2E28',
          },
        },
        fg: {
          value: {
            base: '#2E7D32',
            _dark: '#6BB89A',
          },
        },
      },
    },

    // ── Accent ──
    accent: {
      primary: {
        value: { base: '{colors.rose.600}', _dark: '{colors.radical.pinkBright}' },
      },
      hover: {
        value: { base: '{colors.rose.700}', _dark: '{colors.radical.pinkHover}' },
      },
      secondary: {
        value: { base: '{colors.rose.800}', _dark: '{colors.radical.pink}' },
      },
    },

    // ── Brand (direct-use go-to colors) ──
    brand: {
      primary: {
        value: { base: '{colors.rose.600}', _dark: '{colors.radical.pink}' },
      },
      secondary: {
        value: { base: '{colors.rose.800}', _dark: '{colors.radical.mint}' },
      },
      tertiary: {
        value: { base: '{colors.rose.700}', _dark: '{colors.radical.pinkHover}' },
      },
    },

    // ── Status (direct-use indicators) ──
    status: {
      success: {
        value: { base: '#4CAF50', _dark: '{colors.radical.mint}' },
      },
      warning: {
        value: { base: '#F7A409', _dark: '{colors.radical.orange}' },
      },
      error: {
        value: { base: '#D32F2F', _dark: '{colors.radical.coral}' },
      },
      info: {
        value: { base: '#1976D2', _dark: '{colors.radical.cyan}' },
      },
      neutral: {
        value: { base: '{colors.gray.700}', _dark: '{colors.gray.200}' },
      },
    },

    // ── Priority (direct-use indicators) ──
    priority: {
      urgent: {
        value: { base: '#D32F2F', _dark: '{colors.radical.coral}' },
      },
      high: {
        value: { base: '{colors.rose.500}', _dark: '{colors.radical.pink}' },
      },
      medium: {
        value: { base: '#F48FB1', _dark: '{colors.radical.orange}' },
      },
      low: {
        value: { base: '#81C784', _dark: '{colors.radical.mint}' },
      },
    },

    // ── Color Palettes (for colorPalette prop on Button, Badge, etc.) ──

    // Default button palette
    brandPalette: {
      solid: { value: { base: '{colors.rose.600}', _dark: '{colors.radical.pink}' } },
      contrast: { value: { base: '{colors.white}', _dark: '{colors.white}' } },
      fg: { value: { base: '{colors.rose.600}', _dark: '{colors.radical.pink}' } },
      subtle: { value: { base: '{colors.rose.100}', _dark: '{colors.navy.800}' } },
      muted: { value: { base: '{colors.rose.200}', _dark: '{colors.navy.700}' } },
      emphasized: {
        value: {
          base: '{colors.rose.300}',
          _dark: 'color-mix(in srgb, {colors.radical.pink} 40%, transparent)',
        },
      },
      focusRing: { value: { base: '{colors.rose.600}', _dark: '{colors.radical.pink}' } },
      border: { value: { base: '{colors.rose.600}', _dark: '{colors.radical.pink}' } },
    },

    // Default badge palette
    neutral: {
      solid: { value: { base: '{colors.gray.700}', _dark: '{colors.gray.200}' } },
      contrast: { value: { base: '{colors.white}', _dark: '#12111F' } },
      fg: { value: { base: '{colors.gray.700}', _dark: '{colors.gray.200}' } },
      subtle: { value: { base: '#F0E8EC', _dark: '#1A192C' } },
      muted: { value: { base: '#E0D4DA', _dark: '#232048' } },
      emphasized: { value: { base: '{colors.gray.700}', _dark: '{colors.gray.200}' } },
      focusRing: { value: { base: '{colors.gray.700}', _dark: '{colors.gray.200}' } },
      border: { value: { base: '{colors.gray.700}', _dark: '{colors.gray.200}' } },
    },

    success: {
      solid: { value: { base: '#4CAF50', _dark: '{colors.radical.mint}' } },
      contrast: { value: { base: '{colors.white}', _dark: '#12111F' } },
      fg: { value: { base: '#2E7D32', _dark: '{colors.radical.mint}' } },
      subtle: { value: { base: '#E8F5E9', _dark: '#1A2E2C' } },
      muted: { value: { base: '#C8E6C9', _dark: '#223836' } },
      emphasized: { value: { base: '#4CAF50', _dark: '{colors.radical.mint}' } },
      focusRing: { value: { base: '#4CAF50', _dark: '{colors.radical.mint}' } },
      border: { value: { base: '#4CAF50', _dark: '{colors.radical.mint}' } },
    },

    warning: {
      solid: { value: { base: '#F7A409', _dark: '{colors.radical.orange}' } },
      contrast: { value: { base: '{colors.white}', _dark: '#12111F' } },
      fg: { value: { base: '#E65100', _dark: '{colors.radical.orange}' } },
      subtle: { value: { base: '#FFF3E0', _dark: '#3A3020' } },
      muted: { value: { base: '#FFE0B2', _dark: '#453828' } },
      emphasized: { value: { base: '#F7A409', _dark: '{colors.radical.orange}' } },
      focusRing: { value: { base: '#F7A409', _dark: '{colors.radical.orange}' } },
      border: { value: { base: '#F7A409', _dark: '{colors.radical.orange}' } },
    },

    error: {
      solid: { value: { base: '#D32F2F', _dark: '{colors.radical.coral}' } },
      contrast: { value: { base: '{colors.white}', _dark: '{colors.white}' } },
      fg: { value: { base: '#D32F2F', _dark: '{colors.radical.coral}' } },
      subtle: { value: { base: '#FFEBEE', _dark: '#3D2429' } },
      muted: { value: { base: '#FFCDD2', _dark: '#4A2E34' } },
      emphasized: { value: { base: '#D32F2F', _dark: '{colors.radical.coral}' } },
      focusRing: { value: { base: '#D32F2F', _dark: '{colors.radical.coral}' } },
      border: { value: { base: '#D32F2F', _dark: '{colors.radical.coral}' } },
    },

    info: {
      solid: { value: { base: '#1976D2', _dark: '{colors.radical.cyan}' } },
      contrast: { value: { base: '{colors.white}', _dark: '#12111F' } },
      fg: { value: { base: '#1565C0', _dark: '{colors.radical.cyan}' } },
      subtle: { value: { base: '#E3F2FD', _dark: '#1A2030' } },
      muted: { value: { base: '#BBDEFB', _dark: '#223040' } },
      emphasized: { value: { base: '#1976D2', _dark: '{colors.radical.cyan}' } },
      focusRing: { value: { base: '#1976D2', _dark: '{colors.radical.cyan}' } },
      border: { value: { base: '#1976D2', _dark: '{colors.radical.cyan}' } },
    },

    disabledPalette: {
      solid: { value: { base: '{colors.gray.700}', _dark: '{colors.gray.200}' } },
      contrast: { value: { base: '{colors.white}', _dark: '#12111F' } },
      fg: { value: { base: '{colors.gray.700}', _dark: '{colors.gray.200}' } },
      subtle: { value: { base: '#F0E8EC', _dark: '#1A192C' } },
      muted: { value: { base: '#E0D4DA', _dark: '#232048' } },
      emphasized: { value: { base: '{colors.gray.700}', _dark: '{colors.gray.200}' } },
      focusRing: { value: { base: '{colors.gray.700}', _dark: '{colors.gray.200}' } },
      border: { value: { base: '{colors.gray.700}', _dark: '{colors.gray.200}' } },
    },

    destructivePalette: {
      solid: { value: { base: '#D32F2F', _dark: '{colors.radical.coral}' } },
      contrast: { value: { base: '{colors.white}', _dark: '{colors.white}' } },
      fg: { value: { base: '#D32F2F', _dark: '{colors.radical.coral}' } },
      subtle: { value: { base: '#FFEBEE', _dark: '#3D2429' } },
      muted: { value: { base: '#FFCDD2', _dark: '#4A2E34' } },
      emphasized: { value: { base: '#D32F2F', _dark: '{colors.radical.coral}' } },
      focusRing: { value: { base: '#D32F2F', _dark: '{colors.radical.coral}' } },
      border: { value: { base: '#D32F2F', _dark: '{colors.radical.coral}' } },
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
      value: { base: '{shadows.cardRestLight}', _dark: '{shadows.radicalGlowRest}' },
    },
    glow: {
      value: { base: '{shadows.glowRestLight}', _dark: '{shadows.radicalGlowStrong}' },
    },
    cardHalo: {
      value: { base: '{shadows.cardRestLight}', _dark: '{shadows.radicalGlowNeon}' },
    },
  },
});
