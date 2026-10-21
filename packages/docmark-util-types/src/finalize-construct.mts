/**
 * @file FinalizeConstruct
 * @module docmark-util-types/FinalizeConstruct
 */

import type { Construct } from '@flex-development/docmark-util-types'

/**
 * Finalize a construct.
 *
 * @see {@linkcode Construct}
 *
 * @template {Construct} [T=Construct]
 *  The construct shape
 * @template {T} [U=T]
 *  The construct to finalize
 *
 * @this {void}
 *
 * @param {U} construct
 *  The construct to finalize
 * @return {undefined}
 */
type FinalizeConstruct<T extends Construct = Construct> = <U extends T = T>(
  this: void,
  construct: U
) => undefined

export type { FinalizeConstruct as default }
