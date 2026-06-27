/**
 * @file Type Tests - NamedConstruct
 * @module docmark-util-types/tests/unit-d/NamedConstruct
 */

import type { Construct } from '@flex-development/docmark-util-types'
import type TestSubject from '../named-construct.mts'

describe('unit-d:NamedConstruct', () => {
  it('should extend Construct', () => {
    expectTypeOf<TestSubject>().toExtend<Construct>()
  })

  it('should match [name: string]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('name').toEqualTypeOf<string>()
  })
})
