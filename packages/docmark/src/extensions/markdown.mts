/**
 * @file Extensions - markdown
 * @module docmark/extensions/markdown
 */

import { codes } from '@flex-development/docmark-util-symbol'
import * as commonmark from 'micromark-core-commonmark'
import type { FullNormalizedExtension } from 'micromark-util-types'

/**
 * The markdown syntax extension.
 *
 * @see {@linkcode FullNormalizedExtension}
 *
 * @const {FullNormalizedExtension} markdown
 */
const markdown: FullNormalizedExtension = {
  attentionMarkers: {
    null: [codes.asterisk, codes.underscore]
  },
  contentInitial: {
    [codes.leftSquareBracket]: commonmark.definition
  },
  disable: {
    null: []
  },
  document: {
    [codes.asterisk]: commonmark.list,
    [codes.plusSign]: commonmark.list,
    [codes.dash]: commonmark.list,
    [codes.digit0]: commonmark.list,
    [codes.digit1]: commonmark.list,
    [codes.digit2]: commonmark.list,
    [codes.digit3]: commonmark.list,
    [codes.digit4]: commonmark.list,
    [codes.digit5]: commonmark.list,
    [codes.digit6]: commonmark.list,
    [codes.digit7]: commonmark.list,
    [codes.digit8]: commonmark.list,
    [codes.digit9]: commonmark.list,
    [codes.greaterThan]: commonmark.blockQuote
  },
  flow: {
    [codes.numberSign]: commonmark.headingAtx,
    [codes.asterisk]: commonmark.thematicBreak,
    [codes.dash]: [commonmark.setextUnderline, commonmark.thematicBreak],
    [codes.lessThan]: commonmark.htmlFlow,
    [codes.equalsTo]: commonmark.setextUnderline,
    [codes.underscore]: commonmark.thematicBreak,
    [codes.graveAccent]: commonmark.codeFenced,
    [codes.tilde]: commonmark.codeFenced
  },
  flowInitial: {
    [codes.horizontalTab]: commonmark.codeIndented,
    [codes.virtualSpace]: commonmark.codeIndented,
    [codes.space]: commonmark.codeIndented
  },
  insideSpan: {
    null: [commonmark.attention]
  },
  string: {
    [codes.ampersand]: commonmark.characterReference,
    [codes.backslash]: commonmark.characterEscape
  },
  text: {
    [codes.carriageReturn]: commonmark.lineEnding,
    [codes.lineFeed]: commonmark.lineEnding,
    [codes.carriageReturnLineFeed]: commonmark.lineEnding,
    [codes.exclamationMark]: commonmark.labelStartImage,
    [codes.ampersand]: commonmark.characterReference,
    [codes.asterisk]: commonmark.attention,
    [codes.lessThan]: [commonmark.autolink, commonmark.htmlText],
    [codes.leftSquareBracket]: commonmark.labelStartLink,
    [codes.backslash]: [commonmark.hardBreakEscape, commonmark.characterEscape],
    [codes.rightSquareBracket]: commonmark.labelEnd,
    [codes.underscore]: commonmark.attention,
    [codes.graveAccent]: commonmark.codeText
  }
}

export default markdown
