/**
 * @file Extension
 * @module docmark-util-types/Extension
 */

import type {
  AttentionMarkers,
  ConstructRecord,
  Disable,
  InsideSpan
} from '@flex-development/docmark-util-types'

/**
 * A syntax extension.
 *
 * Syntax extensions are objects whose fields are typically the names of hooks,
 * referring to where constructs "hook" into. The fields at such objects are
 * character codes, mapping to constructs as values.
 *
 * This interface can be augmented to register custom fields.
 *
 * @example
 *  declare module '@flex-development/docmark-util-types' {
 *    interface Extension {
 *      custom?: { null?: Code[] | undefined } | undefined
 *    }
 *  }
 */
interface Extension {
  /**
   * The attention marker settings.
   *
   * @see {@linkcode AttentionMarkers}
   */
  attentionMarkers?: AttentionMarkers | undefined

  /**
   * @todo `comment`
   *
   * @see {@linkcode ConstructRecord}
   */
  comment?: ConstructRecord | undefined

  /**
   * @todo `content`
   *
   * @see {@linkcode ConstructRecord}
   */
  content?: ConstructRecord | undefined

  /**
   * @todo `contentInitial`
   *
   * @see {@linkcode ConstructRecord}
   */
  contentInitial?: ConstructRecord | undefined

  /**
   * The disabled construct settings.
   *
   * @see {@linkcode Disable}
   */
  disable?: Disable | undefined

  /**
   * @todo `document`
   *
   * @see {@linkcode ConstructRecord}
   */
  document?: ConstructRecord | undefined

  /**
   * @todo `flow`
   *
   * @see {@linkcode ConstructRecord}
   */
  flow?: ConstructRecord | undefined

  /**
   * @todo `flowInitial`
   *
   * @see {@linkcode ConstructRecord}
   */
  flowInitial?: ConstructRecord | undefined

  /**
   * @todo `insideSpan`
   *
   * @see {@linkcode InsideSpan}
   */
  insideSpan?: InsideSpan | undefined

  /**
   * @todo `source`
   *
   * @see {@linkcode ConstructRecord}
   */
  source?: ConstructRecord | undefined

  /**
   * @todo `string`
   *
   * @see {@linkcode ConstructRecord}
   */
  string?: ConstructRecord | undefined

  /**
   * @todo `text`
   *
   * @see {@linkcode ConstructRecord}
   */
  text?: ConstructRecord | undefined
}

export type { Extension as default }
