import type {} from '@flex-development/docmark-util-types'

declare module '@flex-development/docmark-util-types' {
  interface TokenFields {
    /**
     * For comments, whether the comment is a TypeScript triple-slash comment.
     *
     * @internal
     */
    triple?: boolean | undefined
  }
}
