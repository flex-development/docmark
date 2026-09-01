/**
 * @file Attempt
 * @module docmark-util-types/Attempt
 */

import type { Constructs, State } from '@flex-development/docmark-util-types'

/**
 * Attempt deals with several constructs,
 * and tries to parse according to those constructs.
 *
 * If a construct results in `ok`, the tokens that were produced are used and
 * the `ok` state is switched to.
 *
 * If the result is `nok`, the attempt failed and the state machine reverts back
 * to its original state.
 *
 * @see {@linkcode Constructs}
 * @see {@linkcode State}
 *
 * @this {void}
 *
 * @param {Constructs} construct
 *  The construct, construct list, or construct record to try
 * @param {State} ok
 *  The successful tokenization state
 * @param {State | undefined} [nok]
 *  The failed tokenization state
 * @return {State}
 *  The next state
 */
type Attempt = (
  this: void,
  construct: Constructs,
  ok: State,
  nok?: State | undefined
) => State

export type { Attempt as default }
