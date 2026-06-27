/**
 * @file Type Tests - InitialConstruct
 * @module docmark-util-types/tests/unit-d/InitialConstruct
 */

import type {
  Construct,
  Initializer
} from '@flex-development/docmark-util-types'
import type TestSubject from '../initial-construct.mts'

describe('unit-d:InitialConstruct', () => {
  it('should extend Construct', () => {
    expectTypeOf<TestSubject>().toExtend<Construct>()
  })

  it('should match [tokenize: Initializer]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('tokenize')
      .toEqualTypeOf<Initializer>()
  })
})
