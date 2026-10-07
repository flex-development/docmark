/**
 * @file Type Tests - InitialConstructs
 * @module docmark-util-types/tests/unit-d/InitialConstructs
 */

import type {
  ContentType,
  InitialConstruct
} from '@flex-development/docmark-util-types'
import type { OptionalKeys } from '@flex-development/tutils'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../initial-constructs.mts'

describe('unit-d:InitialConstructs', () => {
  type Optional = OptionalKeys<TestSubject>

  it('should match [language?: InitialConstruct | undefined]', () => {
    expectTypeOf<Optional>().extract<'language'>().not.toBeNever()
    expectTypeOf<TestSubject>()
      .toHaveProperty('language')
      .toEqualTypeOf<InitialConstruct | undefined>()
  })

  it('should match Omit<Record<ContentType, InitialConstruct>, "language">', () => {
    // Arrange
    type Expect = Omit<Record<ContentType, InitialConstruct>, 'language'>

    // Expect
    expectTypeOf<TestSubject>().toMatchObjectType<Expect>()
  })
})
