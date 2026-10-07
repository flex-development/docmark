/**
 * @file extension
 * @module examples/jaymark/extension
 */

import tags from '@flex-development/docmark-extension-tags'
import {
  combineExtensions
} from '@flex-development/docmark-util-combine-extensions'
import { codes, constants, tt } from '@flex-development/docmark-util-symbol'
import type { NormalizedExtension } from '@flex-development/docmark-util-types'
import arrayExpression from './constructs/array.expression.mts'
import blockComment from './constructs/block.comment.mts'
import booleanExpression from './constructs/boolean.expression.mts'
import lineComment from './constructs/line.comment.mts'
import nullExpression from './constructs/null.expression.mts'
import numberExpression from './constructs/number.expression.mts'
import objectExpression from './constructs/object.expression.mts'
import stringExpression from './constructs/string.expression.mts'

/**
 * The JSONC syntax extension.
 *
 * @todo unicode escape support
 *
 * @see {@linkcode NormalizedExtension}
 *
 * @const {NormalizedExtension} extension
 */
const extension: NormalizedExtension = combineExtensions(tags, {
  [constants.contentTypeComments]: {
    [codes.slash]: [blockComment, lineComment]
  },
  [constants.contentTypeExpression]: {
    [codes.quotationMark]: stringExpression, // string
    [codes.plusSign]: numberExpression, // number (explicit positive)
    [codes.dash]: numberExpression, // number (negative)
    [codes.digit0]: numberExpression, // number
    [codes.digit1]: numberExpression, // number
    [codes.digit2]: numberExpression, // number
    [codes.digit3]: numberExpression, // number
    [codes.digit4]: numberExpression, // number
    [codes.digit5]: numberExpression, // number
    [codes.digit6]: numberExpression, // number
    [codes.digit7]: numberExpression, // number
    [codes.digit8]: numberExpression, // number
    [codes.digit9]: numberExpression, // number
    [codes.leftSquareBracket]: arrayExpression, // array
    [codes.lowercaseF]: booleanExpression, // false
    [codes.lowercaseN]: nullExpression, // null
    [codes.lowercaseT]: booleanExpression, // true
    [codes.leftCurlyBrace]: objectExpression // object
  },
  [constants.extensionFieldDisable]: { null: [tt.summary] },
  [constants.extensionFieldSettings]: {}
})

export default extension
