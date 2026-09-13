/**
 * @file Type Tests - NamedOptions
 * @module docmark-factory-line/interfaces/tests/unit-d/NamedOptions
 */

import type {
  ConstructWithName,
  Options
} from '@flex-development/docmark-factory-line'
import type { RequiredKeys } from '@flex-development/tutils'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../options-named.mts'

describe('unit-d:interfaces/NamedOptions', () => {
  type Required = RequiredKeys<TestSubject>

  it('should extend Options', () => {
    expectTypeOf<TestSubject>().toExtend<Options>()
  })

  it('should match [construct: ConstructWithName]', () => {
    expectTypeOf<Required>().extract<'construct'>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('construct')
      .toEqualTypeOf<ConstructWithName>()
  })
})
