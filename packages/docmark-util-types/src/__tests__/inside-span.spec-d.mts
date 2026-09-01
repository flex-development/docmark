/**
 * @file Type Tests - InsideSpan
 * @module docmark-util-types/tests/unit-d/InsideSpan
 */

import type { AnyConstruct } from '@flex-development/docmark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../inside-span.mts'

describe('unit-d:InsideSpan', () => {
  it('should match [null?: Pick<AnyConstruct, "resolveAll">[] | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('null')
      .toEqualTypeOf<Pick<AnyConstruct, 'resolveAll'>[] | undefined>()
  })
})
