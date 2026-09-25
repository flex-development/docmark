/**
 * @file Type Tests - ContainerState
 * @module docmark-util-types/tests/unit-d/ContainerState
 */

import type { Token } from '@flex-development/docmark-util-types'
import type * as micromark from 'micromark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../container-state.mts'

describe('unit-d:ContainerState', () => {
  it('should extend micromark.ContainerState', () => {
    expectTypeOf<TestSubject>().toExtend<micromark.ContainerState>()
  })

  it('should match [comment?: Token | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('comment')
      .toEqualTypeOf<Token | undefined>()
  })

  it('should match [opener?: Token | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('opener')
      .toEqualTypeOf<Token | undefined>()
  })

  it('should match [openerWidth?: number | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('openerWidth')
      .toEqualTypeOf<number | undefined>()
  })
})
