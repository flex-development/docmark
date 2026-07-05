import type { Effects } from '@flex-development/mark/parse'

declare module '@flex-development/mark/parse' {
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
