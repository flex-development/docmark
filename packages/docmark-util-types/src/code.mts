/**
 * @file Code
 * @module docmark-util-types/Code
 */

/**
 * A character code.
 *
 * This often the same as what [`String#codePointAt`][codepointat] yields,
 * but docmark adds meaning to other values as well.
 *
 * The code `null` represents the end of the input stream (`eos`).
 * Negative integers are used instead of certain sequences of characters (such
 * as line endings and tabs).
 *
 * [codepointat]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt
 */
type Code = number | null

export type { Code as default }
