import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

import { slotRecipes } from './recipes';
import { semanticTokens } from './semantic-tokens';
import { tokens } from './tokens';

const proletariatTheme = defineConfig({
  theme: {
    tokens,
    semanticTokens,
    // recipes,
    slotRecipes,
  },
});

export const system = createSystem(defaultConfig, proletariatTheme);

export { recipes, slotRecipes } from './recipes';
export { semanticTokens } from './semantic-tokens';
export { tokens } from './tokens';
