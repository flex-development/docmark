/**
 * @file ContentType
 * @module docmark-util-types/ContentType
 */

import type * as micromark from 'micromark-util-types'

/**
 * Union of content types.\
 * Content types are used on tokens to define their subcontent type.
 *
 * The highest level of content is `source`, and represents a source document or
 * source content fragment.
 *
 * The next level is `comment`, and represents the contents of a documentation
 * comment after the opening delimiter and before the closing delimiter.\
 * By default, comment content consists of an optional summary followed by zero
 * or more block tags.
 *
 * @todo document markdown content levels
 *
 * @see {@linkcode micromark.ContentType}
 */
type ContentType = micromark.ContentType | 'comment' | 'source' | 'type'

export type { ContentType as default }
