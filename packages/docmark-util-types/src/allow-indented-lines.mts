/**
 * @file Type Aliases - AllowIndentedLines
 * @module docmark-util-types/AllowIndentedLines
 */

import type { TokenizeContext } from '@flex-development/docmark-util-types'

/**
 * Check whether continued lines can be indented in lieu of explicit markers.
 *
 * A continued line is any line after the first line of an active comment.\
 * When indented syntax is enabled, line markers for a continued line are any
 * character codes satisfying the `whitespace` predicate.
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
