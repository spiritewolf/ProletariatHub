import tseslint from 'typescript-eslint';

import rootConfig from '../../eslint.config';

export default tseslint.config(...rootConfig, {
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ['eslint.config.ts', 'prisma.config.ts', 'prisma/seed.ts'],
      },
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
