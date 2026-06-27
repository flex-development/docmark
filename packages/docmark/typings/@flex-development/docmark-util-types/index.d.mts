import type {} from '@flex-development/docmark-util-types'

declare module '@flex-development/docmark-util-types' {
  interface TokenizeContext {
    /**
     * Whether a summary is allowed.
     *
     * The documentation content up until the first block tag is considered the
     * comment summary.
     *
     * @internal
     */
    summaryAllowed?: boolean | null | undefined
  }

  interface Token {
    /**
     * The value of the token.
     *
     * @internal
     */
    value?: string | null | undefined
  }
}
