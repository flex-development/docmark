import type {} from '@flex-development/docmark-util-types'

declare module '@flex-development/docmark-util-types' {
  interface ContainerState {
    /**
     * Whether markdown indentation was is active.
     *
     * This is used to protect indentation that should be parsed as markdown,
     * i.e. line prefixes inside indented code.
     *
     * @internal
     */
    markdownIndent?: boolean | undefined
  }
}
