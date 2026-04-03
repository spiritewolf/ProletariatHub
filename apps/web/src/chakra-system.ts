import { createSystem, defaultConfig } from '@chakra-ui/react';
import { flowPalette } from './flow-theme';

/**
 * App design system: default Chakra tokens plus brand colors for flow UIs.
 */
export const appSystem = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          solid: { value: flowPalette.maroon },
          contrast: { value: flowPalette.pageBg },
          muted: { value: flowPalette.muted },
        },
      },
    },
  },
  globalCss: {
    body: {
      bg: flowPalette.pageBg,
      color: flowPalette.text,
    },
  },
});
