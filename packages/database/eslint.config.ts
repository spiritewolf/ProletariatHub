import { defineConfig } from 'eslint/config';

import rootConfig from '../../eslint.config';

export default defineConfig([
  { ignores: ['src/generated/**', 'scripts/**'] },
  ...rootConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.ts', 'prisma.config.ts', 'prisma/seed.ts'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
