import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

import { recipes, slotRecipes } from './recipes';
import { semanticTokens } from './semanticTokens';
import { tokens } from './tokens';

const proletariatTheme = defineConfig({
  theme: {
    tokens,
    semanticTokens,
    recipes,
    slotRecipes,
  },
});

export const system = createSystem(defaultConfig, proletariatTheme);

export { recipes, slotRecipes } from './recipes';
export { semanticTokens } from './semanticTokens';
export { tokens } from './tokens';
