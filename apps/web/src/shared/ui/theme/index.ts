import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

import { recipes, slotRecipes } from './recipes';
import { semanticTokens } from './semanticTokens';
import { textStyles } from './textStyles';
import { tokens } from './tokens';

const proletariatTheme = defineConfig({
  theme: {
    tokens,
    semanticTokens,
    recipes,
    slotRecipes,
    textStyles,
  },
});

export const system = createSystem(defaultConfig, proletariatTheme);

export { recipes, slotRecipes } from './recipes';
export { semanticTokens } from './semanticTokens';
export { textStyles } from './textStyles';
export { tokens } from './tokens';
