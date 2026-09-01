import type { Construct, State } from '@flex-development/docmark-util-types'
import type * as mark from '@flex-development/mark/parse'

declare module '@flex-development/docmark-util-types' {
  interface CommentKindMap {
    hashbang?: 'hashbang'
  }

  interface ContainerState {
    /**
     * At the `source`-level, whether markdown indentation was detected.
     *
     * This is used by some comment constructs to protect indentation that
     * should be parsed as markdown, i.e. line prefixes inside indented code.
     *
     * @internal
     */
    markdownIndent?: boolean | undefined

    /**
     * For block tag containers and type expressions,
     * the current tag name identifier.
     *
     * @internal
     */
    tag?: string | undefined
  }

  interface TokenFields {
    /**
     * For type expression chunks, the current tag name identifier.
     *
     * @internal
     */
    tag?: string | undefined
  }

  interface TokenTypeMap {
    interpreterPath: 'interpreterPath'
  }

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
     * When trying a construct, whether {@linkcode Construct.previous}
     * should **not** be called.
     *
     * If `false`, `previous` should be called via {@linkcode State} function.
     *
     * @internal
     */
    noPrevious?: boolean | undefined

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
