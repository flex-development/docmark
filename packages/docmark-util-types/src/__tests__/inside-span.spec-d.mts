/**
 * @file Type Tests - InsideSpan
 * @module docmark-util-types/tests/unit-d/InsideSpan
 */

import type { Construct } from '@flex-development/docmark-util-types'
import type TestSubject from '../inside-span.mts'

describe('unit-d:types/InsideSpan', () => {
  it('should match [null?: Pick<Construct, "resolveAll">[] | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('null')
      .toEqualTypeOf<Pick<Construct, 'resolveAll'>[] | undefined>()
  })
})
