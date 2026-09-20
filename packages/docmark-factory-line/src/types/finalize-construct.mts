/**
 * @file Type Aliases - FinalizeConstruct
 * @module docmark-factory-line/types/FinalizeConstruct
 */

import type { ContinuableConstruct } from '@flex-development/docmark-util-types'

/**
 * Finalize a line comment construct.
 *
 * @see {@linkcode ContinuableConstruct}
 *
 * @template {ContinuableConstruct} T
 *  The construct to finalize
 *
 * @this {void}
 *
 * @param {ContinuableConstruct} construct
 *  The construct to finalize
 * @return {undefined}
 */
type FinalizeConstruct = (
  this: void,
  construct: ContinuableConstruct
) => undefined

export type { FinalizeConstruct as default }
