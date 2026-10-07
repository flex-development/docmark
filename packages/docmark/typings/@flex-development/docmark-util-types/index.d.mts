import type {
  Construct,
  Create,
  Place,
  State
} from '@flex-development/docmark-util-types'
import type * as mark from '@flex-development/mark/parse'

declare module '@flex-development/docmark-util-types' {
  interface ContainerState {
  }

  interface ContentTypeMap {
    source: 'source'
  }

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

  interface TokenFields {
    /**
     * For comments, whether the comment is a TypeScript triple-slash comment.
     *
     * @internal
     */
    triple?: boolean | undefined
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
     * Whether the position of the tokenizer moves forward at stream breaks.
     */
    moveOnBreak?: boolean | null | undefined

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
     * The current place in the content.
     *
     * @see {@linkcode Place}
     *
     * @internal
     * @readonly
     */
    readonly place: Place

    /**
     * Get the string value of a slice of chunks.
     *
     * @see {@linkcode mark.SerializeChunks}
     *
     * @internal
     */
    serializeChunks: mark.SerializeChunks

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
