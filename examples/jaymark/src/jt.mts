/**
 * @file jt
 * @module examples/jaymark/jt
 */

/**
 * The token type dictionary.
 *
 * @enum {Lowercase<string>}
 */
const jt = {
  arrayExpression: 'arrayExpression',
  arrayMarker: 'arrayMarker',
  booleanExpression: 'booleanExpression',
  fieldSeparator: 'fieldSeparator',
  nullExpression: 'nullExpression',
  numberExpression: 'numberExpression',
  objectExpression: 'objectExpression',
  objectMarker: 'objectMarker',
  stringExpression: 'stringExpression',
  stringMarker: 'stringMarker',
  unexpectedValue: 'unexpectedValue',
  valueSeparator: 'valueSeparator'
} as const

export default jt
