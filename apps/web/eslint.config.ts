import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

import rootConfig from '../../eslint.config';

const MAX_RELATIVE_PARENT_SEGMENTS = 6;

function relativeSiblingGlobs(segment: string): readonly string[] {
  const globs: string[] = [];
  for (let depth = 1; depth <= MAX_RELATIVE_PARENT_SEGMENTS; depth++) {
    const prefix = '../'.repeat(depth);
    globs.push(`${prefix}${segment}`, `${prefix}${segment}/**`);
  }
  return globs;
}

const appNoRelativeCrossLayerImports = {
  patterns: [
    {
      group: [...relativeSiblingGlobs('features'), ...relativeSiblingGlobs('shared')],
      message:
        'Import from @proletariat-hub/web/features or @proletariat-hub/web/shared/... instead of relative paths out of app/.',
    },
  ],
};

const featuresNoAppImports = {
  patterns: [
    {
      group: [
        '@proletariat-hub/web/app',
        '@proletariat-hub/web/app/**',
        ...relativeSiblingGlobs('app'),
      ],
      message: 'Features must not import from app/.',
    },
  ],
};

const sharedNoFeatureOrAppImports = {
  patterns: [
    {
      group: [
        '@proletariat-hub/web/features',
        '@proletariat-hub/web/features/**',
        '@proletariat-hub/web/app',
        '@proletariat-hub/web/app/**',
        ...relativeSiblingGlobs('features'),
        ...relativeSiblingGlobs('app'),
      ],
      message:
        'Shared code must not import from features/ or app/; use @proletariat-hub/web/shared/... or other allowed modules.',
    },
  ],
};

export default [
  ...rootConfig,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...react.configs.flat.recommended?.rules,
      ...react.configs.flat['jsx-runtime']?.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['src/app/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', appNoRelativeCrossLayerImports],
    },
  },
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', featuresNoAppImports],
    },
  },
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', sharedNoFeatureOrAppImports],
    },
  },
];
