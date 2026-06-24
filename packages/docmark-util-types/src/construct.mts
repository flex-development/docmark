/**
 * @file Construct
 * @module docmark-util-types/Construct
 */

import type {
  ConstructPosition,
  ConstructRecord,
  Exiter,
  Previous,
  Resolver,
  Tokenizer
} from '@flex-development/docmark-util-types'

/**
 * Object describing how to tokenize a syntax construct.
 */
interface Construct {
  /**
   * Whether the construct, when in a {@linkcode ConstructRecord}, takes
   * precedence over existing constructs for the same character code when
   * merged.
   *
   * @see {@linkcode ConstructPosition}
   */
  add?: ConstructPosition | undefined

  /**
   * Whether the construct is concrete.
   *
   * Concrete constructs cannot be interrupted by other constructs.
   *
   * For example, when parsing a markdown document (containers, such as block
   * quotes and lists) and this construct is parsing fenced code:
   *
   * ````markdown
   * > ```js
   * > - list?
   * ````
   *
   * …then `- list?` cannot form if this fenced code construct is concrete.
   *
   * An example of a construct that is not concrete is a GFM table:
   *
   * ````markdown
   * | a |
   * | - |
   * > | b |
   * ````
   *
   * ...`b` is not part of the table.
   */
  concrete?: boolean | undefined

  /**
   * For containers, a continuation construct.
   */
  continuation?: Construct | undefined

  /**
   * For containers, a final exit hook.
   *
   * @see {@linkcode Exiter}
   */
  exit?: Exiter | undefined

  /**
   * The name of the construct, used to toggle constructs off.
   *
   * > 👉 **Note**: Named constructs must not be {@linkcode partial}.
   */
  name?: string | undefined

  /**
   * Whether the construct represents a partial construct.
   *
   * > 👉 **Note**: Partial constructs must not have a {@linkcode name}.
   */
  partial?: boolean | undefined

  /**
   * Check if the previous character code can precede this construct.
   *
   * @see {@linkcode Previous}
   */
  previous?: Previous | undefined

  /**
   * Resolve the events parsed by {@linkcode tokenize}.
   *
   * @see {@linkcode Resolver}
   */
  resolve?: Resolver | undefined

  /**
   * Resolve all events when the content is complete, from the start to the end.
   *
   * > 👉 **Note**: Only called if {@linkcode tokenize} is successful at least
   * > once in the content.
   *
   * @see {@linkcode Resolver}
   */
  resolveAll?: Resolver | undefined

  /**
   * Resolve the events parsed from the start of the content (which may include
   * other constructs) to the last one parsed by {@linkcode tokenize}.
   *
   * @see {@linkcode Resolver}
   */
  resolveTo?: Resolver | undefined

  /**
   * Set up a state machine to handle character codes streaming in.
   *
   * @see {@linkcode Tokenizer}
   */
  tokenize: Tokenizer
}

export type { Construct as default }
