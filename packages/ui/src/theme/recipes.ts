import { defineRecipe, defineSlotRecipe } from '@chakra-ui/react';
import { cardAnatomy } from '@chakra-ui/react/anatomy';

const touchSm = {
  h: '11',
  minW: '11',
  textStyle: 'sm',
  px: '4',
  gap: '2',
  _icon: { width: '5', height: '5' },
} as const;

const touchMd = {
  h: { base: '11', md: '10' },
  minW: { base: '11', md: '10' },
  textStyle: 'sm',
  px: { base: '4', md: '4' },
  gap: '2',
  _icon: { width: '5', height: '5' },
} as const;

const touchLg = {
  h: { base: '12', md: '11' },
  minW: { base: '12', md: '11' },
  textStyle: 'md',
  px: { base: '5', md: '5' },
  gap: '3',
  _icon: { width: '5', height: '5' },
} as const;

export const buttonRecipe = defineRecipe({
  className: 'chakra-button',
  base: {
    display: 'inline-flex',
    appearance: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    position: 'relative',
    borderRadius: 'l2',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    borderWidth: '1px',
    borderColor: 'transparent',
    cursor: 'button',
    flexShrink: '0',
    outline: '0',
    lineHeight: '1.2',
    isolation: 'isolate',
    fontWeight: 'semibold',
    transitionProperty: 'common',
    transitionDuration: 'moderate',
    focusVisibleRing: 'outside',
    focusRingColor: 'accent.primary',
    _disabled: {
      layerStyle: 'disabled',
    },
    _icon: {
      flexShrink: '0',
    },
    _light: {
      transitionProperty: 'common, box-shadow',
      _hover: {
        shadow: 'glow',
      },
    },
    _dark: {
      focusVisibleRing: 'none',
      transitionProperty: 'common, box-shadow',
      _hover: {
        shadow: 'glow',
      },
      _focusVisible: {
        shadow: 'glow',
      },
    },
    colorPalette: 'brandPalette',
  },
  variants: {
    size: {
      '2xs': {
        h: '6',
        minW: '6',
        textStyle: 'xs',
        px: '2',
        gap: '1',
        _icon: { width: '3.5', height: '3.5' },
      },
      xs: {
        h: '8',
        minW: '8',
        textStyle: 'xs',
        px: '2.5',
        gap: '1',
        _icon: { width: '4', height: '4' },
      },
      sm: touchSm,
      md: touchMd,
      lg: touchLg,
      xl: {
        h: '12',
        minW: '12',
        textStyle: 'md',
        px: '5',
        gap: '2.5',
        _icon: { width: '5', height: '5' },
      },
      '2xl': {
        h: '16',
        minW: '16',
        textStyle: 'lg',
        px: '7',
        gap: '3',
        _icon: { width: '6', height: '6' },
      },
    },
    variant: {
      solid: {
        bg: 'colorPalette.solid',
        color: 'colorPalette.contrast',
        borderColor: 'transparent',
        _hover: {
          bg: 'colorPalette.solid/90',
        },
        _expanded: {
          bg: 'colorPalette.solid/90',
        },
      },
      subtle: {
        bg: 'colorPalette.subtle',
        color: 'colorPalette.fg',
        borderColor: 'transparent',
        _hover: {
          bg: 'colorPalette.muted',
        },
        _expanded: {
          bg: 'colorPalette.muted',
        },
      },
      surface: {
        bg: 'colorPalette.subtle',
        color: 'colorPalette.fg',
        shadow: '0 0 0px 1px var(--shadow-color)',
        shadowColor: 'colorPalette.muted',
        _hover: {
          bg: 'colorPalette.muted',
        },
        _expanded: {
          bg: 'colorPalette.muted',
        },
      },
      outline: {
        borderWidth: '1px',
        '--outline-color-legacy': 'colors.colorPalette.muted',
        '--outline-color': 'colors.colorPalette.border',
        borderColor: 'var(--outline-color, var(--outline-color-legacy))',
        color: 'colorPalette.fg',
        _hover: {
          bg: 'colorPalette.subtle',
        },
        _expanded: {
          bg: 'colorPalette.subtle',
        },
      },
      ghost: {
        bg: 'transparent',
        color: 'colorPalette.fg',
        _hover: {
          bg: 'colorPalette.subtle',
        },
        _expanded: {
          bg: 'colorPalette.subtle',
        },
      },
      plain: {
        color: 'colorPalette.fg',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'solid',
  },
});

export const cardSlotRecipe = defineSlotRecipe({
  className: 'chakra-card',
  slots: cardAnatomy.keys(),
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      minWidth: '0',
      wordWrap: 'break-word',
      borderRadius: 'l3',
      color: 'text.primary',
      textAlign: 'start',
      transitionProperty: 'common, box-shadow',
      transitionDuration: 'moderate',
      _dark: {
        shadow: 'card',
      },
    },
    title: {
      fontWeight: 'bold',
      color: 'text.primary',
    },
    description: {
      color: 'text.secondary',
      fontSize: 'sm',
    },
    header: {
      paddingInline: 'var(--card-padding)',
      paddingTop: 'var(--card-padding)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5',
    },
    body: {
      padding: 'var(--card-padding)',
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      gap: '2',
      paddingInline: 'var(--card-padding)',
      paddingBottom: 'var(--card-padding)',
    },
  },
  variants: {
    size: {
      sm: {
        root: { '--card-padding': 'spacing.4' },
        title: { textStyle: 'md' },
      },
      md: {
        root: { '--card-padding': { base: 'spacing.4', md: 'spacing.6' } },
        title: { textStyle: 'lg' },
      },
      lg: {
        root: { '--card-padding': { base: 'spacing.5', md: 'spacing.7' } },
        title: { textStyle: 'xl' },
      },
    },
    variant: {
      elevated: {
        root: {
          bg: 'bg.secondary',
          shadow: 'card',
        },
      },
      outline: {
        root: {
          bg: 'bg.primary',
          borderWidth: '1px',
          borderColor: 'accent.primary',
          _light: {
            shadow: 'card',
            bg: 'bg.primary',
            borderColor: 'border.primary',
          },
          _dark: {
            borderColor: 'border.primary',
            bg: 'navy.600',
            // borderColor: '#2C3258',
            // shadow: 'cardHalo',
          },
        },
      },
      subtle: {
        root: {
          bg: 'bg.secondary',
          _light: {
            shadow: 'none',
          },
        },
      },
    },
  },
  defaultVariants: {
    variant: 'outline',
    size: 'md',
  },
});

export const inputRecipe = defineRecipe({
  className: 'chakra-input',
  base: {
    width: '100%',
    minWidth: '0',
    outline: '0',
    position: 'relative',
    appearance: 'none',
    textAlign: 'start',
    borderRadius: 'l2',
    color: 'text.primary',
    _disabled: {
      layerStyle: 'disabled',
    },
    height: 'var(--input-height)',
    minW: 'var(--input-height)',
    '--focus-color': 'colors.accent.primary',
    '--error-color': 'colors.status.error',
    transitionProperty: 'common, box-shadow',
    transitionDuration: 'moderate',
    _invalid: {
      focusRingColor: 'var(--error-color)',
      borderColor: 'var(--error-color)',
    },
  },
  variants: {
    size: {
      '2xs': {
        textStyle: 'xs',
        px: '2',
        '--input-height': 'sizes.7',
      },
      xs: {
        textStyle: 'xs',
        px: '2',
        '--input-height': 'sizes.8',
      },
      sm: {
        textStyle: 'sm',
        px: '2.5',
        '--input-height': { base: 'sizes.11', md: 'sizes.9' },
      },
      md: {
        textStyle: 'sm',
        px: '3',
        '--input-height': { base: 'sizes.11', md: 'sizes.10' },
      },
      lg: {
        textStyle: 'md',
        px: '4',
        '--input-height': { base: 'sizes.12', md: 'sizes.11' },
      },
      xl: {
        textStyle: 'md',
        px: '4.5',
        '--input-height': 'sizes.12',
      },
      '2xl': {
        textStyle: 'lg',
        px: '5',
        '--input-height': 'sizes.16',
      },
    },
    variant: {
      outline: {
        bg: 'bg.light',
        borderWidth: '1px',
        borderColor: 'border.primary',
        focusVisibleRing: 'inside',
        focusRingColor: 'var(--focus-color)',
        _dark: {
          focusVisibleRing: 'none',
          _focusVisible: {
            borderColor: 'accent.primary',
            shadow: 'glow',
          },
        },
      },
      subtle: {
        borderWidth: '1px',
        borderColor: 'transparent',
        bg: 'bg.secondary',
        focusVisibleRing: 'inside',
        focusRingColor: 'var(--focus-color)',
        _dark: {
          focusVisibleRing: 'none',
          _focusVisible: {
            borderColor: 'accent.primary',
            shadow: 'glow',
          },
        },
      },
      flushed: {
        bg: 'transparent',
        borderBottomWidth: '1px',
        borderBottomColor: 'border.primary',
        borderRadius: '0',
        px: '0',
        _focusVisible: {
          borderColor: 'var(--focus-color)',
          boxShadow: '0px 1px 0px 0px var(--focus-color)',
          _invalid: {
            borderColor: 'var(--error-color)',
            boxShadow: '0px 1px 0px 0px var(--error-color)',
          },
        },
        _dark: {
          _focusVisible: {
            borderBottomColor: 'accent.primary',
            boxShadow: 'none',
            shadow: 'glow',
            _invalid: {
              borderBottomColor: 'var(--error-color)',
              boxShadow: 'none',
              shadow: 'none',
            },
          },
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'outline',
  },
});

export const badgeRecipe = defineRecipe({
  className: 'chakra-badge',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: 'full',
    gap: '1',
    fontWeight: 'semibold',
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    minH: { base: '8', md: '7' },
    px: '2.5',
    colorPalette: 'neutral',
  },
  variants: {
    variant: {
      solid: {
        bg: 'colorPalette.solid',
        color: 'colorPalette.contrast',
      },
      subtle: {
        bg: 'colorPalette.subtle',
        color: 'colorPalette.fg',
      },
      outline: {
        color: 'colorPalette.fg',
        '--outline-shadow-legacy': 'colors.colorPalette.muted',
        '--outline-shadow': 'colors.colorPalette.border',
        shadow: 'inset 0 0 0px 1px var(--shadow-color)',
        shadowColor: 'var(--outline-shadow, var(--outline-shadow-legacy))',
      },
      surface: {
        bg: 'colorPalette.subtle',
        color: 'colorPalette.fg',
        shadow: 'inset 0 0 0px 1px var(--shadow-color)',
        shadowColor: 'colorPalette.muted',
      },
      plain: {
        color: 'colorPalette.fg',
      },
    },
    size: {
      xs: {
        textStyle: '2xs',
        px: '1',
        minH: { base: '7', md: '6' },
      },
      sm: {
        textStyle: 'xs',
        px: '1.5',
        minH: { base: '8', md: '7' },
      },
      md: {
        textStyle: 'sm',
        px: '2',
        minH: { base: '9', md: '8' },
      },
      lg: {
        textStyle: 'sm',
        px: '2.5',
        minH: { base: '10', md: '9' },
      },
    },
  },
  defaultVariants: {
    variant: 'subtle',
    size: 'sm',
  },
});

export const headingRecipe = defineRecipe({
  className: 'chakra-heading',
  base: {
    fontFamily: 'heading',
    fontWeight: 'bold',
    color: 'text.primary',
  },
  variants: {
    size: {
      xs: { textStyle: 'xs' },
      sm: { textStyle: 'sm' },
      md: { textStyle: 'md' },
      lg: { textStyle: 'lg' },
      xl: { textStyle: 'xl' },
      '2xl': { textStyle: '2xl' },
      '3xl': { textStyle: '3xl' },
      '4xl': { textStyle: '4xl' },
      '5xl': { textStyle: '5xl' },
      '6xl': { textStyle: '6xl' },
      '7xl': { textStyle: '7xl' },
    },
  },
  defaultVariants: {
    size: 'xl',
  },
});

export const recipes = {
  badge: badgeRecipe,
  button: buttonRecipe,
  heading: headingRecipe,
  input: inputRecipe,
};

export const slotRecipes = {
  card: cardSlotRecipe,
};
