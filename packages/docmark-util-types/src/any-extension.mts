/**
 * @file AnyExtension
 * @module docmark-util-types/AnyExtension
 */

import type { Extension } from '@flex-development/docmark-util-types'
import type * as micromark from 'micromark-util-types'

/**
 * A `docmark` or `micromark` syntax extension.
 *
 * @see {@linkcode Extension}
 * @see {@linkcode micromark.Extension}
 */
type AnyExtension = Extension | micromark.Extension

export type { AnyExtension as default }
