/**
 * @file AnyConstruct
 * @module docmark-util-types/AnyConstruct
 */

import type { Construct } from '@flex-development/docmark-util-types'
import type * as micromark from 'micromark-util-types'

/**
 * A `docmark` or `micromark` construct.
 *
 * @see {@linkcode Construct}
 * @see {@linkcode micromark.Construct}
 */
type AnyConstruct = Construct | micromark.Construct

export type { AnyConstruct as default }
