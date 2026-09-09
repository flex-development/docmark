/**
 * @file Internal - terminate
 * @module docmark-factory-markers/internal/terminate
 */

import type { State } from '@flex-development/docmark-util-types'

/**
 * Get the final marker sequence state.
 *
 * @internal
 *
 * @this {void}
 *
 * @param {null | undefined} mandatory
 *  Whether an unexpected marker should successfully terminate a sequence
 * @param {State} ok
 *  The successful tokenization state
 * @param {State} nok
 *  The failed tokenization state
 * @return {State}
 *  The next state
 */
function terminate(
  this: void,
  mandatory: null | undefined,
  ok: State,
  nok: State
): State {
  if (mandatory === null) return ok
  return nok
}

export default terminate
