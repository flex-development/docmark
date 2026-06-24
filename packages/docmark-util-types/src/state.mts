/**
 * @file State
 * @module docmark-util-types/State
 */

import type { Code } from '@flex-development/docmark-util-types'

/**
 * The main unit in the state machine: a function that gets a character code and
 * has certain effects.
 *
 * A state function returns another function: the next state-as-a-function to go
 * to, or `undefined` when a final state is reached.
 *
 * @see {@linkcode Code}
 *
 * @this {void}
 *
 * @param {Code} code
 *  The current character code
 * @return {State | undefined}
 *  The next state
 */
type State = (this: void, code: Code) => State | undefined

export type { State as default }
