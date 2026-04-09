import tseslint from 'typescript-eslint';

import rootConfig from '../../eslint.config';

export default tseslint.config(...rootConfig, {
  files: ['**/*.ts'],
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ['eslint.config.ts'],
      },
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
