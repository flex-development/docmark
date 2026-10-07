import type { ConstructRecord } from '@flex-development/docmark-util-types'
import type { Options } from '@flex-development/jaymark'

declare module '@flex-development/docmark-util-types' {
  interface ContainerState {
    /**
     * For array expressions, the current array nesting depth.
     *
     * The first array expression marker in the content establishes a nesting
     * depth of one. Nested left square brackets increase the depth, while right
     * square brackets decrease it.\
     * An array expression closes when the depth returns to zero.
     */
    arrays?: number | undefined

    /**
     * For object expressions, the current object nesting depth.
     *
     * The first object expression marker in the content establishes a nesting
     * depth of one. Nested left curly braces increase the depth, while right
     * curly braces decrease it.\
     * An object expression closes when the depth returns to zero.
     */
    objects?: number | undefined
  }

  interface Extension {
    expression?: ConstructRecord | undefined
  }

  interface ParseContext {
    /**
     * Whether a comment is not allowed.
     */
    skipComment?: boolean | undefined
  }

  interface Settings {
    json?: Options | null | undefined
  }

  interface TokenTypeMap {
    arrayExpression: 'arrayExpression'
    arrayMarker: 'arrayMarker'
    booleanExpression: 'booleanExpression'
    fieldSeparator: 'fieldSeparator'
    nullExpression: 'nullExpression'
    numberExpression: 'numberExpression'
    objectExpression: 'objectExpression'
    objectMarker: 'objectMarker'
    stringExpression: 'stringExpression'
    stringMarker: 'stringMarker'
    unexpectedValue: 'unexpectedValue'
    valueSeparator: 'valueSeparator'
  }
}
