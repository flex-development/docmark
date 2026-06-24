import type { Effects } from '@flex-development/docmark-util-types'

declare module '@flex-development/docmark-util-types' {
  interface TokenizeContext {
    /**
     * The context object to transition the state machine.
     *
     * @internal
     *
     * @see {@linkcode Effects}
     */
    readonly effects: Effects
  }
}
