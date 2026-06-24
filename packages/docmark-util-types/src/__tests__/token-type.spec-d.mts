/**
 * @file Type Tests - TokenType
 * @module docmark-util-types/tests/unit-d/TokenType
 */

import type { TokenTypeMap } from '@flex-development/docmark-util-types'
import type TestSubject from '../token-type.mts'

describe('unit-d:types/TokenType', () => {
  it('should equal TokenTypeMap[keyof TokenTypeMap]', () => {
    // Arrange
    type Expect = TokenTypeMap[keyof TokenTypeMap]

    // Expect
    expectTypeOf<TestSubject>().toEqualTypeOf<Expect>()
  })
})
