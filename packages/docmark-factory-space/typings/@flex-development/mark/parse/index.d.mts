import type * as docmark from '@flex-development/docmark-util-types'
import type { Effects } from '@flex-development/mark/parse'

declare module '@flex-development/mark/parse' {
  interface ContentTypeMap {
    comment: 'comment'
    content: 'content'
    document: 'document'
    flow: 'flow'
    source: 'source'
    string: 'string'
    text: 'text'
    type: 'type'
  }

  interface ContextMap {
    tokenize: docmark.TokenizeContext
  }

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

  interface TokenTypeMap extends docmark.TokenTypeMap {}
}
