/**
 * @file Type Tests - ContainerState
 * @module docmark-util-types/tests/unit-d/ContainerState
 */

import type { TokenFields } from '@flex-development/docmark-util-types'
import type * as micromark from 'micromark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../container-state.mts'

describe('unit-d:ContainerState', () => {
  it('should extend micromark.ContainerState', () => {
    expectTypeOf<TestSubject>().toExtend<micromark.ContainerState>()
  })

  it('should match [comment?: TokenFields["kind"] | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('comment')
      .toEqualTypeOf<TokenFields['kind'] | undefined>()
  })

  it('should match [documentation?: TokenFields["_nfo"] | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('documentation')
      .toEqualTypeOf<TokenFields['info'] | undefined>()
  })
})
