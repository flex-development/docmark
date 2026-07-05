import type {} from '@flex-development/docmark-util-types'
import type * as mark from '@flex-development/mark/parse'

declare module '@flex-development/docmark-util-types' {
  interface TokenizeContext {
    /**
     * Internal boolean shared with `micromark-extension-gfm-table` indicating
     * whether body rows are not affected by normal interruption rules.
     *
     * @internal
     */
    _gfmTableDynamicInterruptHack?: boolean | undefined

    /**
     * Internal boolean shared with `micromark-extension-gfm-task-list-item` to
     * signal whether the tokenizer is tokenizing the first content of a list
     * item construct.
     *
     * @internal
     */
    _gfmTasklistFirstContentOfListItem?: boolean | undefined

    /**
     * Whether a summary is allowed.
     *
     * The documentation content up until the first block tag is considered the
     * comment summary.
     *
     * @internal
     */
    summaryAllowed?: boolean | null | undefined

    /**
     * The token factory.
     *
     * @see {@linkcode mark.CreateToken}
     *
     * @internal
     */
    token: mark.CreateToken
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
