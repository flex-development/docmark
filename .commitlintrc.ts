/**
 * @file Configuration - commitlint
 * @module config/commitlint
 * @see https://commitlint.js.org
 */

import {
  RuleConfigSeverity as Severity,
  type UserConfig
} from '@commitlint/types'
import { scopes } from '@flex-development/commitlint-config'

/**
 * `commitlint` configuration object.
 *
 * @const {UserConfig} config
 */
const config: UserConfig = {
  extends: ['@flex-development'],
  rules: {
    'scope-enum': [Severity.Error, 'always', scopes([
      'chore',
      'docmark',
      'factory-space',
      'subtokenize',
      'symbol'
    ])],
    'scope-max-length': [Severity.Error, 'always', Number.POSITIVE_INFINITY]
  }
}

export default config
