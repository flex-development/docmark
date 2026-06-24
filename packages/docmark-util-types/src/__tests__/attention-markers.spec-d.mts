/**
 * @file Type Tests - AttentionMarkers
 * @module docmark-util-types/tests/unit-d/AttentionMarkers
 */

import type { Code } from '@flex-development/docmark-util-types'
import type TestSubject from '../attention-markers.mts'

describe('unit-d:types/AttentionMarkers', () => {
  it('should match [null?: Code[] | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('null')
      .toEqualTypeOf<Code[] | undefined>()
  })
})
