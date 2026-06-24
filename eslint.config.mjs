/**
 * @file eslint
 * @module config/eslint
 * @see https://eslint.org/docs/user-guide/configuring
 */

import fldv from '@flex-development/eslint-config'
import pathe from '@flex-development/pathe'
import fs from 'node:fs'

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
    rules: {
      'node/no-unsupported-features/node-builtins': [
        2,
        {
          allowExperimental: true,
          version: fs.readFileSync(pathe.resolve('.nvmrc'), 'utf8').trim()
        }
      ]
    }
  },
  {
    files: ['packages/docmark-util-symbol/src/codes.mts'],
    rules: {
      'sort-keys': 0
    }
  }
]

export default config
