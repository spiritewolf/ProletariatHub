import { defineConfig } from 'eslint/config';

import rootConfig from '../../eslint.config';

export default defineConfig([
  ...rootConfig,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            'eslint.config.ts',
            'vitest.config.ts',
            'test/loginSession.test.ts',
          ],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
