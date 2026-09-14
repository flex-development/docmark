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
 * @param {boolean | undefined} optional
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
  optional: boolean | undefined,
  ok: State,
  nok: State
): State {
  return optional ? ok : nok
}

export default terminate
