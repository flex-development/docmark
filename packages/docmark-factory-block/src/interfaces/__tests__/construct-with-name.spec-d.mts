/**
 * @file Type Tests - ConstructWithName
 * @module docmark-factory-block/interfaces/tests/unit-d/ConstructWithName
 */

import type { NamedConstruct } from '@flex-development/docmark-util-types'
import type { RequiredKeys } from '@flex-development/tutils'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../construct-with-name.mts'

describe('unit-d:interfaces/ConstructWithName', () => {
  type Required = RequiredKeys<TestSubject>

  it('should extend Partial<NamedConstruct>', () => {
    expectTypeOf<TestSubject>().toExtend<Partial<NamedConstruct>>()
  })

  it('should match [name: Sequence]', () => {
    expectTypeOf<Required>().extract<'name'>().not.toBeNever()
    expectTypeOf<TestSubject>().toHaveProperty('name').toEqualTypeOf<string>()
  })
})
