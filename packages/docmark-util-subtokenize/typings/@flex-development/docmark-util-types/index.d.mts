import type { Create } from '@flex-development/docmark-util-types'

declare module '@flex-development/docmark-util-types' {
  interface ParseContext {
    /**
     * Create a source language parser.
     *
     * @see {@linkcode Create}
     *
     * @internal
     */
    language?: Create | undefined
  }
}
