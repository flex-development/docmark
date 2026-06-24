/**
 * @file Effects
 * @module docmark-util-types/Effects
 */

import type {
  Attempt,
  Check,
  Consume,
  Enter,
  Exit,
  Interrupt
} from '@flex-development/docmark-util-types'

/**
 * Context object to transition the state machine.
 */
interface Effects {
  /**
   * Try to tokenize a construct.
   *
   * @see {@linkcode Attempt}
   */
  attempt: Attempt

  /**
   * Try to tokenize a construct, then revert.
   *
   * @see {@linkcode Check}
   */
  check: Check

  /**
   * Deal with a character code and move onto the next.
   *
   * @see {@linkcode Consume}
   */
  consume: Consume

  /**
   * Start a new token.
   *
   * @see {@linkcode Enter}
   */
  enter: Enter

  /**
   * Close an open token.
   *
   * @see {@linkcode Exit}
   */
  exit: Exit

  /**
   * Try to tokenize a construct, then revert.
   *
   * > 👉 **Note**: Sets `context.interrupt` to `true`.
   *
   * @see {@linkcode Interrupt}
   */
  interrupt: Interrupt
}

export type { Effects as default }
