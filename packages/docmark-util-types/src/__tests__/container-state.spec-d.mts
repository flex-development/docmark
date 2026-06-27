/**
 * @file Type Tests - ContainerState
 * @module docmark-util-types/tests/unit-d/ContainerState
 */

import type * as micromark from 'micromark-util-types'
import type TestSubject from '../container-state.mts'

describe('unit-d:ContainerState', () => {
  it('should extend micromark.ContainerState', () => {
    expectTypeOf<TestSubject>().toExtend<micromark.ContainerState>()
  })
})
