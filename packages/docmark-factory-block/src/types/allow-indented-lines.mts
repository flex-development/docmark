/**
 * @file Type Aliases - AllowIndentedLines
 * @module docmark-factory-block/types/AllowIndentedLines
 */

import type { TokenizeContext } from '@flex-development/docmark-util-types'
import type { whitespace } from '@flex-development/mark-util-character'

/**
 * Check whether continued lines can be indented in lieu of an explicit marker.
 *
 * A continued line is any line after that first line of an active comment.\
 * When indented syntax is enabled, the line marker for a continued line is any
 * character code satisfying the {@linkcode whitespace} predicate.
 *
 * @see {@linkcode TokenizeContext}
 *
 * @this {TokenizeContext}
 *
 * @return {boolean}
 *  Whether a continued line can be indented
 */
type AllowIndentedLines = (this: TokenizeContext) => boolean

export type { AllowIndentedLines as default }
