/**
 * @file eslint
 * @module config/eslint
 * @see https://eslint.org/docs/user-guide/configuring
 */

import fldv from '@flex-development/eslint-config'
import pathe from '@flex-development/pathe'

/**
 * eslint configuration.
 *
 * @type {import('eslint').Linter.Config[]}
 * @const config
 */
const config = [
  ...fldv.configs.node,
  {
    files: ['**/*.+(cjs|cts|js|jsx|mjs|mts|ts|tsx)'],
    languageOptions: {
      parserOptions: {
        project: pathe.resolve('tsconfig.eslint.json')
      }
    },
    rules: {
      'node/no-unsupported-features/node-builtins': [
        2,
        {
          allowExperimental: true,
          version: '>=17.0.0'
        }
      ],
      'unicorn/escape-case': [2, 'lowercase']
    }
  },
  {
    files: [
      '__fixtures__/constructs/*.mts',
      'packages/docmark-grammar/**/*.mts',
      'packages/docmark/**/constructs/*.mts',
      'packages/docmark/src/initialize/*.mts'
    ],
    rules: {
      'unicorn/no-this-assignment': 0
    }
  },
  {
    files: ['packages/docmark-util-symbol/src/codes.mts'],
    rules: {
      'sort-keys': 0
    }
  },
  {
    files: [
      'packages/docmark-util-types/src/__tests__/encoding-map.spec-d.mts',
      'packages/docmark-util-types/src/encoding-map.mts'
    ],
    rules: {
      'unicorn/text-encoding-identifier-case': 0
    }
  },
  {
    files: ['packages/docmark-util-types/src/preprocessor.mts'],
    rules: {
      'jsdoc/valid-types': 0
    }
  }
]

export default config
