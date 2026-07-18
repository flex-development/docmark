import type * as docmark from '@flex-development/docmark-util-types'
import type {} from '@flex-development/mark/parse'

declare module '@flex-development/mark/parse' {
  interface ContainerState extends docmark.ContainerState {}

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

  interface Extension extends docmark.Extension {}

  interface TokenFields extends docmark.TokenFields {}

  interface TokenTypeMap extends docmark.TokenTypeMap {}
}
