/**
 * @file ParseOptions
 * @module docmark-util-types/ParseOptions
 */

import type {
  AnyExtension,
  ContentType,
  FinalizeContext,
  InitialConstruct,
  InitialConstructs
} from '@flex-development/docmark-util-types'

/**
 * Configuration object defining how to parse.
 *
 * This interface can be augmented to register custom fields.
 *
 * @example
 *  declare module '@flex-development/docmark-util-types' {
 *    interface ParseOptions {
 *      from?: Point | null | undefined
 *    }
 *  }
 */
interface ParseOptions {
  /**
   * The list of syntax extensions to apply.
   *
   * @see {@linkcode AnyExtension}
   */
  extensions?: AnyExtension[] | null | undefined

  /**
   * Finalize the tokenization context.
   *
   * @see {@linkcode FinalizeContext}
   */
  finalizeContext?: FinalizeContext | null | undefined

  /**
   * Record where each key is {@linkcode ContentType},
   * and each value is an {@linkcode InitialConstruct} override.
   */
  initializers?: Partial<InitialConstructs> | null | undefined
}

export type { ParseOptions as default }
