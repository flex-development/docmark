/**
 * @file Extension
 * @module docmark-util-types/Extension
 */

import type {
  AttentionMarkers,
  ConstructRecord,
  Disable,
  InsideSpan,
  Settings
} from '@flex-development/docmark-util-types'

/**
 * A syntax extension.
 *
 * Syntax extensions are objects whose fields are typically the names of hooks,
 * referring to where constructs "hook" into. The fields at such objects are
 * character codes, mapping to constructs as values, while other fields provide
 * parser configuration or additional behavior.
 *
 * This interface can be augmented to register custom fields.
 *
 * @example
 *  declare module '@flex-development/docmark-util-types' {
 *    interface Extension {
 *      codeTags?: { null?: string[] | undefined } | undefined
 *    }
 *  }
 */
interface Extension {
  /**
   * Register markers that can be used to trigger markdown attention constructs.
   *
   * @see {@linkcode AttentionMarkers}
   */
  attentionMarkers?: AttentionMarkers | undefined

  /**
   * Parse `comment` content.
   *
   * @see {@linkcode ConstructRecord}
   */
  comment?: ConstructRecord | undefined

  /**
   * Parse comments.
   *
   * @see {@linkcode ConstructRecord}
   */
  comments?: ConstructRecord | undefined

  /**
   * Parse markdown block-level content like paragraphs and definitions.
   *
   * @see {@linkcode ConstructRecord}
   */
  content?: ConstructRecord | undefined

  /**
   * Parse initial markdown `content`.
   *
   * Use `contentInitial` to define constructs that start at the absolute
   * beginning of a markdown content block or a new line within a paragraph,
   * notably before the paragraph content itself is fully parsed.
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
   * Parse markdown containers.
   *
   * @see {@linkcode ConstructRecord}
   */
  document?: ConstructRecord | undefined

  /**
   * Parse markdown block content.
   *
   * @see {@linkcode ConstructRecord}
   */
  flow?: ConstructRecord | undefined

  /**
   * Parse initial markdown `flow`.
   *
   * Use `flowInitial` to define constructs that start at the absolute beginning
   * of a markdown block.
   *
   * @see {@linkcode ConstructRecord}
   */
  flowInitial?: ConstructRecord | undefined

  /**
   * Resolvers to run after inline markdown text has been parsed.
   *
   * @see {@linkcode InsideSpan}
   */
  insideSpan?: InsideSpan | undefined

  /**
   * Additional settings.
   *
   * @see {@linkcode Settings}
   */
  settings?: Settings | undefined

  /**
   * Parse markdown `string` content.
   *
   * Markdown string content is text-like content that only allows character
   * references and character escapes.
   * It exists in things such as markdown identifiers (e.g. media references,
   * definitions), titles, or URLs and such.
   *
   * @see {@linkcode ConstructRecord}
   */
  string?: ConstructRecord | undefined

  /**
   * Parse markdown phrasing content.
   *
   * @see {@linkcode ConstructRecord}
   */
  text?: ConstructRecord | undefined

  /**
   * Parse type expressions.
   *
   * @see {@linkcode ConstructRecord}
   */
  type?: ConstructRecord | undefined
}

export type { Extension as default }
