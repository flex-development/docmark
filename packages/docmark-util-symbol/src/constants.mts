/**
 * @file constants
 * @module docmark-util-symbol/constants
 */

/**
 * Constant values.
 *
 * @enum {number | string}
 */
const constants = Object.freeze({
  attentionSideAfter: 2,
  attentionSideBefore: 1,
  atxHeadingOpeningFenceSizeMax: 6,
  autolinkDomainSizeMax: 63,
  autolinkSchemeSizeMax: 32,
  cdataOpeningString: 'CDATA[',
  characterGroupPunctuation: 2,
  characterGroupWhitespace: 1,
  characterReferenceDecimalSizeMax: 7,
  characterReferenceHexadecimalSizeMax: 6,
  characterReferenceNamedSizeMax: 31,
  codeFencedSequenceSizeMin: 3,
  contentTypeContent: 'content',
  contentTypeDocument: 'document',
  contentTypeFlow: 'flow',
  contentTypeString: 'string',
  contentTypeText: 'text',
  hardBreakPrefixSizeMin: 2,
  htmlBasic: 6,
  htmlCdata: 5,
  htmlComment: 2,
  htmlComplete: 7,
  htmlDeclaration: 4,
  htmlInstruction: 3,
  htmlRaw: 1,
  htmlRawSizeMax: 8,
  linkReferenceSizeMax: 999,
  linkResourceDestinationBalanceMax: 32,
  listItemValueSizeMax: 10,
  numericBaseDecimal: 10,
  numericBaseHexadecimal: 0x10,
  tabSize: 4,
  thematicBreakMarkerCountMin: 3,
  v8MaxSafeChunkSize: 10_000
} as const)

export default constants
