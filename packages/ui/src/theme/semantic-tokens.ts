import { defineSemanticTokens } from '@chakra-ui/react';

/**
 * Light default uses `_light`; dark uses `_dark` (class `.dark` on an ancestor, e.g. from `next-themes`).
 */
export const semanticTokens = defineSemanticTokens({
  colors: {
    bg: {
      page: {
        value: { _light: '{colors.canvas.light}', _dark: '{colors.navy.950}' },
      },
      surface: {
        DEFAULT: {
          value: { _light: '{colors.white}', _dark: '{colors.navy.900}' },
        },
        muted: {
          value: { _light: '{colors.rose.50}', _dark: '{colors.navy.800}' },
        },
      },
      header: {
        DEFAULT: {
          value: { _light: '{colors.rose.900}', _dark: '{colors.navy.900}' },
        },
        dark: {
          value: { _light: '{colors.rose.950}', _dark: '{colors.headerInk}' },
        },
      },
      callout: {
        value: { _light: '{colors.rose.100}', _dark: '{colors.navy.800}' },
      },
    },
    border: {
      default: {
        value: { _light: '{colors.rose.300}', _dark: '{colors.navy.600}' },
      },
      subtle: {
        value: { _light: '{colors.rose.200}', _dark: '{colors.navy.700}' },
      },
    },
    text: {
      primary: {
        value: { _light: '#2D1B30', _dark: '#E4E4E4' },
      },
      secondary: {
        value: { _light: '#6B5B6E', _dark: '#8A8A9E' },
      },
      onHeader: {
        value: { _light: '{colors.white}', _dark: '#E4E4E4' },
      },
    },
    accent: {
      primary: {
        DEFAULT: {
          value: { _light: '{colors.rose.600}', _dark: '{colors.radical.pink}' },
        },
        hover: {
          value: { _light: '{colors.rose.700}', _dark: '{colors.radical.pinkHover}' },
        },
      },
      secondary: {
        value: { _light: '{colors.rose.800}', _dark: '{colors.radical.mint}' },
      },
    },
    priority: {
      urgent: {
        value: { _light: '{colors.status.red}', _dark: '{colors.radical.coral}' },
      },
      high: {
        value: { _light: '{colors.rose.500}', _dark: '{colors.radical.pink}' },
      },
      medium: {
        value: { _light: '{colors.priority.rose}', _dark: '{colors.radical.orange}' },
      },
      low: {
        value: { _light: '{colors.priority.green}', _dark: '{colors.radical.mint}' },
      },
    },
    status: {
      success: {
        value: { _light: '{colors.status.green}', _dark: '{colors.radical.mint}' },
      },
      warning: {
        value: { _light: '{colors.status.orange}', _dark: '{colors.radical.yellow}' },
      },
      error: {
        value: { _light: '{colors.status.red}', _dark: '{colors.radical.coral}' },
      },
    },
    /** `colorPalette="brand"` on Button, Badge, etc. */
    brand: {
      contrast: {
        value: { _light: '{colors.white}', _dark: '{colors.white}' },
      },
      fg: {
        value: { _light: '{colors.rose.600}', _dark: '{colors.radical.pink}' },
      },
      subtle: {
        value: { _light: '{colors.rose.100}', _dark: '{colors.navy.800}' },
      },
      muted: {
        value: { _light: '{colors.rose.200}', _dark: '{colors.navy.700}' },
      },
      emphasized: {
        value: {
          _light: '{colors.rose.300}',
          _dark: 'color-mix(in srgb, {colors.radical.pink} 40%, transparent)',
        },
      },
      solid: {
        value: { _light: '{colors.rose.600}', _dark: '{colors.radical.pink}' },
      },
      focusRing: {
        value: { _light: '{colors.rose.600}', _dark: '{colors.radical.pink}' },
      },
      border: {
        value: { _light: '{colors.rose.600}', _dark: '{colors.radical.pink}' },
      },
    },
    priorityUrgent: {
      contrast: { value: { _light: '{colors.white}', _dark: '{colors.white}' } },
      fg: { value: { _light: '{colors.status.red}', _dark: '{colors.radical.coral}' } },
      subtle: {
        value: {
          _light: '#FFEBEE',
          _dark: '#3D2429',
        },
      },
      muted: {
        value: {
          _light: '#FFCDD2',
          _dark: '#4A2E34',
        },
      },
      emphasized: {
        value: { _light: '{colors.status.red}', _dark: '{colors.radical.coral}' },
      },
      solid: { value: { _light: '{colors.status.red}', _dark: '{colors.radical.coral}' } },
      focusRing: { value: { _light: '{colors.status.red}', _dark: '{colors.radical.coral}' } },
      border: { value: { _light: '{colors.status.red}', _dark: '{colors.radical.coral}' } },
    },
    priorityHigh: {
      contrast: { value: { _light: '{colors.white}', _dark: '{colors.white}' } },
      fg: { value: { _light: '{colors.rose.500}', _dark: '{colors.radical.pink}' } },
      subtle: {
        value: {
          _light: '#FCE4EC',
          _dark: '#3A2438',
        },
      },
      muted: {
        value: {
          _light: '#F8BBD0',
          _dark: '#452A42',
        },
      },
      emphasized: {
        value: { _light: '{colors.rose.600}', _dark: '{colors.radical.pinkHover}' },
      },
      solid: { value: { _light: '{colors.rose.500}', _dark: '{colors.radical.pink}' } },
      focusRing: { value: { _light: '{colors.rose.500}', _dark: '{colors.radical.pink}' } },
      border: { value: { _light: '{colors.rose.500}', _dark: '{colors.radical.pink}' } },
    },
    priorityMedium: {
      contrast: { value: { _light: '#2D1B30', _dark: '{colors.navy.950}' } },
      fg: { value: { _light: '{colors.rose.700}', _dark: '{colors.radical.orange}' } },
      subtle: {
        value: {
          _light: '#FDF0F4',
          _dark: '#3A3020',
        },
      },
      muted: {
        value: {
          _light: '#FCE4ED',
          _dark: '#453828',
        },
      },
      emphasized: {
        value: { _light: '{colors.rose.600}', _dark: '{colors.radical.orange}' },
      },
      solid: { value: { _light: '{colors.priority.rose}', _dark: '{colors.radical.orange}' } },
      focusRing: { value: { _light: '{colors.rose.500}', _dark: '{colors.radical.orange}' } },
      border: { value: { _light: '{colors.rose.400}', _dark: '{colors.radical.orange}' } },
    },
    priorityLow: {
      contrast: { value: { _light: '{colors.white}', _dark: '{colors.navy.950}' } },
      fg: { value: { _light: '#2E7D32', _dark: '{colors.radical.mint}' } },
      subtle: {
        value: {
          _light: '#E8F5E9',
          _dark: '#1A2E2C',
        },
      },
      muted: {
        value: {
          _light: '#C8E6C9',
          _dark: '#223836',
        },
      },
      emphasized: {
        value: { _light: '{colors.priority.green}', _dark: '{colors.radical.mint}' },
      },
      solid: { value: { _light: '{colors.priority.green}', _dark: '{colors.radical.mint}' } },
      focusRing: { value: { _light: '{colors.priority.green}', _dark: '{colors.radical.mint}' } },
      border: { value: { _light: '{colors.priority.green}', _dark: '{colors.radical.mint}' } },
    },
  },
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
  },
});
