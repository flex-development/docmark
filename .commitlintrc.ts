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
    'header-max-length': [Severity.Error, 'always', 105],
    'scope-enum': [Severity.Error, 'always', scopes([
      'chore',
      'docmark',
      'combine-extensions',
      'factory-identifier',
      'factory-markers',
      'factory-space',
      'grammar',
      'subtokenize',
      'symbol'
    ])],
    'scope-max-length': [Severity.Error, 'always', Number.POSITIVE_INFINITY]
  }
}

export default config
