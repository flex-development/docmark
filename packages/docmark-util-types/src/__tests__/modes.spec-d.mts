/**
 * @file Type Tests - Modes
 * @module docmark-util-types/tests/unit-d/Modes
 */

import type { CommentKind, Mode } from '@flex-development/docmark-util-types'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../modes.mts'

describe('unit-d:Modes', () => {
  it('should match Partial<Record<CommentKind, Mode | null | undefined>>', () => {
    // Arrange
    type Expect = Partial<Record<CommentKind, Mode | null | undefined>>

    // Expect
    expectTypeOf<TestSubject>().toMatchObjectType<Expect>()
  })
})
