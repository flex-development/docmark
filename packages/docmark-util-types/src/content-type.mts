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
 * The next level is `comment`, and represents the lines of a comment, i.e.
 * comment content. By default it includes comment summaries and block tags.
 *
 * @todo document markdown content levels
 *
 * @see {@linkcode micromark.ContentType}
 */
type ContentType = micromark.ContentType | 'comment' | 'source'

export type { ContentType as default }
