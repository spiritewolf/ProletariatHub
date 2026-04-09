import { defineTokens } from '@chakra-ui/react';

export const tokens = defineTokens({
  colors: {
    rose: {
      50: { value: '#FDF2F5' },
      100: { value: '#FDE8EE' },
      200: { value: '#F0D4E0' },
      300: { value: '#E8B4C8' },
      400: { value: '#DC96B0' },
      500: { value: '#E91E63' },
      600: { value: '#C2185B' },
      700: { value: '#AD1457' },
      800: { value: '#8E244D' },
      900: { value: '#6B1D3A' },
      950: { value: '#4A1228' },
    },
    navy: {
      50: { value: '#E8E7F0' },
      100: { value: '#CDCCE4' },
      200: { value: '#9B98C9' },
      300: { value: '#6965AE' },
      400: { value: '#45407A' },
      500: { value: '#2F2B64' },
      600: { value: '#2D2B55' },
      700: { value: '#232048' },
      800: { value: '#1E1A4A' },
      900: { value: '#1A1640' },
      950: { value: '#141228' },
    },
    headerInk: { value: '#0F0D20' },
    canvas: {
      light: { value: '#F8ECF0' },
    },
    radical: {
      pink: { value: '#FF428E' },
      pinkHover: { value: '#FF5C9E' },
      mint: { value: '#A8FFEF' },
      yellow: { value: '#DFF959' },
      orange: { value: '#F7A409' },
      magenta: { value: '#F834BB' },
      cyan: { value: '#2BF5E9' },
      purple: { value: '#D831D7' },
      coral: { value: '#FF594C' },
    },
    priority: {
      rose: { value: '#F48FB1' },
      green: { value: '#81C784' },
    },
    status: {
      green: { value: '#4CAF50' },
      orange: { value: '#F7A409' },
      red: { value: '#D32F2F' },
    },
  },
  fonts: {
    body: { value: 'Inter, system-ui, sans-serif' },
    heading: { value: 'Inter, system-ui, sans-serif' },
  },
  fontSizes: {
    'prose-sm': { value: '0.9375rem' },
  },
  shadows: {
    cardLight: {
      value: '0 1px 4px 0 rgba(45, 27, 48, 0.07)',
    },
    cardRestLight: {
      value: '0 1px 4px 0 rgba(45, 27, 48, 0.07), 0 0 0 1px rgba(232, 180, 200, 0.14)',
    },
    radicalGlowRest: {
      value: '0 0 12px rgba(255, 66, 142, 0.15), 0 0 4px rgba(255, 66, 142, 0.1)',
    },
    radicalGlowStrong: {
      value: '0 0 20px rgba(255, 66, 142, 0.25)',
    },
    glowRestLight: {
      value: '0 4px 16px rgba(194, 24, 91, 0.1), 0 0 0 1px rgba(194, 24, 91, 0.12)',
    },
  },
});
