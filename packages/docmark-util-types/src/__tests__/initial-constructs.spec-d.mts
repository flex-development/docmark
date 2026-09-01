/**
 * @file Type Tests - InitialConstructs
 * @module docmark-util-types/tests/unit-d/InitialConstructs
 */

import type {
  ContentType,
  InitialConstruct
} from '@flex-development/docmark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../initial-constructs.mts'

describe('unit-d:InitialConstructs', () => {
  it('should equal Record<ContentType, InitialConstruct>', () => {
    // Arrange
    type Expect = Record<ContentType, InitialConstruct>

    // Expect
    expectTypeOf<TestSubject>().toEqualTypeOf<Expect>()
  })
})
