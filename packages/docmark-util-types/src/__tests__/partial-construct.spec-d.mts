/**
 * @file Type Tests - PartialConstruct
 * @module docmark-util-types/tests/unit-d/PartialConstruct
 */

import type { Construct } from '@flex-development/docmark-util-types'
import type TestSubject from '../partial-construct.mts'

describe('unit-d:interfaces/PartialConstruct', () => {
  it('should extend Construct', () => {
    expectTypeOf<TestSubject>().toExtend<Construct>()
  })

  it('should match [partial: true]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('partial').toEqualTypeOf<true>()
  })
})
