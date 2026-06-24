/**
 * @file Type Tests - Token
 * @module docmark-util-types/tests/unit-d/Token
 */

import type {
  Position,
  TokenFields,
  TokenType
} from '@flex-development/docmark-util-types'
import type TestSubject from '../token.mts'

describe('unit-d:interfaces/Token', () => {
  it('should extend Position', () => {
    expectTypeOf<TestSubject>().toExtend<Position>()
  })

  it('should extend TokenFields', () => {
    expectTypeOf<TestSubject>().toExtend<TokenFields>()
  })

  it('should match [type: T]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('type')
      .toEqualTypeOf<TokenType>()
  })
})
