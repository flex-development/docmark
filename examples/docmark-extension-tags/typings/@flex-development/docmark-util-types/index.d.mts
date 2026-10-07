import type {} from '@flex-development/docmark-util-types'

declare module '@flex-development/docmark-util-types' {
  interface ContainerState {
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

  interface TokenizeContext {
    /**
     * When trying a construct, whether {@linkcode Construct.previous}
     * should **not** be called.
     *
     * If `false`, `previous` should be called via {@linkcode State} function.
     *
     * @internal
     */
    noPrevious?: boolean | undefined
  }
}
